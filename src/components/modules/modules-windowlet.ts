import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ModuleForm, ModuleParams } from './commons';
import { KanaloaAPI } from '../../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../../components/windowlet';
import { BasicModule, BASIC_MODULES, getAllModules, PLUGIN_MODULES } from './modules-list';
import KanaloaAddressBook from "kanaloa-address-book.json";
import { Contract, ethers } from 'ethers';

@customElement('modules-windowlet')
export class ModulesWindowlet extends KanaloaWindowlet {

    @state()
    declare baseModule: ModuleParams;
    @state()
    declare onchainModules: Record<string, ethers.BytesLike>;
    @state()
    declare selectedModules: ModuleForm[];
    @property({ type: String })
    declare contractAddress: string;
    
    @state()
    contract: Promise<Contract | undefined>;

    protected formCache: Record<BasicModule, ModuleForm> = {};

    static get styles() {
        return [
            ...super.styles,
            css`
                :host {
                    padding: 0;
                    overflow-x: hidden;
                    flex: 1;
                }

                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    overflow: scroll;
                    flex: 1 1 0;
                }
                
                li {
                    display: flex;
                    align-items: center;
                    padding: 0 1rem;
                    user-select: none;
                    box-sizing: border-box;
                    justify-content: space-between;
                    line-height: 3rem;
                }

                .base-module {
                    background-color: var(--primary-light-color);
                    color: var(--foreground-light-color);
                    position: sticky;
                    border-radius: inherit inherit 0 0;
                    height: 3.2rem;
                    width: 100%;
                }

                .redundant-container {
                    max-height: 100%;
                    overflow-y: auto;
                }

                input[type="radio"] {
                    display: none;
                }

                input[type="checkbox"] {
                    transform: scale(1.5);
                }
            `
        ];
    }

    constructor() {
        super();
        this.selectedModules = [];
        this.onchainModules = {};
        this.contract = new Promise(() => undefined);
    }

    attributeChangedCallback(
        name: string, _old: string | null, value: string | null
    ): void {
        super.attributeChangedCallback(name, _old, value);

        if (name != "contractAddress") {
            return;
        }

        if (this.contractAddress) {
            this.contract = new Promise(
                () => new Contract(
                    this.contractAddress, [ 
                        "function getActiveModule(" 
                            + "bytes32 signature"
                        + ") view returns (address)",
                        "function peek("
                            + "bytes32 signature"
                        + ") view returns (bytes memory)"
                    ], KanaloaAPI.wallet
                )
            );
        } else {
            this.contract = new Promise(() => undefined);
        }
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.selectedModules = this.getSelectedModules();
        this.dispatchEvent(
            new CustomEvent(
                "selected-modules-updated", 
                { bubbles: true, composed: true }
            )
        );
    }

    private onClickRadioHandler(ev: Event) {
        const radio: HTMLInputElement = 
            (ev.currentTarget as HTMLLIElement).querySelector("input")!;
        radio.checked = true;
        radio.dispatchEvent(new Event("change-module"));
    }

    moduleListChanged(e: Event) : void {
        this.selectedModules = this.getSelectedModules();
        this.dispatchEvent(
            new CustomEvent(
                "selected-modules-updated", 
                { bubbles: true, composed: true }
            )
        );
    }

    getSelectedModules(): ModuleForm[] {
        const selectedModules: ModuleParams[] = [ 
            BASIC_MODULES.find(
                (x) => x.value == this.baseModule.value
            )!,
            ...(
                Array.from(
                    this.shadowRoot?.querySelectorAll(
                        "input.module-enable[type='checkbox']:checked"
                    ) || []
                ).map(
                    (x) => 
                        PLUGIN_MODULES[this.baseModule.value]
                            .find((y) => y.value == x.getAttribute("value"))!
                )
            )
        ];
        
        const modules = [];
        for (let i = 0; i < selectedModules.length; i++) {
            const mod = selectedModules[i];
            if (this.formCache[mod.value] == null) {
                this.formCache[mod.value] = 
                    document.createElement(mod.customElement) as ModuleForm;
                // TODO: init form values if the module is not new
            }   
            modules.push(this.formCache[mod.value]);
            this.formCache[mod.value].setParent(modules[0]);
        }

        return modules;
    }

    async scanModule(sig: string): Promise<[string, ethers.BytesLike]> {
        // We probe the associated contract to check if a module is marked as
        // installed in the contract, and if it is, we execute "peek" over it
        const contract = await this.contract;
        if (contract == null) {
            return [ethers.ZeroAddress, ""];
        }

        const implementation: string = await contract.getActiveModule(sig);
        const data = 
            (implementation != ethers.ZeroAddress) ? 
                await contract.peek(sig) : "";

        return [implementation, data];
    }

    render() {
        // NOTE: there are better ways to do this, but this is quick and
        // serviceable
        const baseModuleParams: ModuleParams = 
            BASIC_MODULES.find(
                (x) => x.value == this.baseModule.value
            ) as ModuleParams;
        const otherModules: ModuleParams[] =
            PLUGIN_MODULES[this.baseModule.value] || [];
        const availableModules = repeat(otherModules, 
            (x) => html`
                <li @click=${this.onClickRadioHandler}>
                    <input type="radio"
                        name="_selectedModule"
                        value="${x.value}"
                        .moduleInfo=${x}
                    />
                    <label for="${x.value}-enable">
                        ${x.name}
                    </label>
                    ${
                        // If this has no associated contract, it's a new
                        // contract, and therefore needs no fancy async
                        (this.contract == null) ?
                            html`
                                <input type="checkbox"
                                    class="module-enable"
                                    name="${x.value}-enable"
                                    value="${x.value}"
                                    @change=${this.moduleListChanged}
                                />
                            ` : html`

                            `
                    }
                </li>
            `
        );

        

        return html`
            <ul>
                <li 
                    class="base-module"
                    @click=${this.onClickRadioHandler}
                >
                    <input type="radio"
                        name="_selectedModule"
                        value="${baseModuleParams.value}"
                        .moduleInfo=${baseModuleParams}
                        checked 
                    />
                    ${baseModuleParams.name}
                </li>
                ${
                    (otherModules.length != 0) ?
                        availableModules :
                        html`
                            <li style="margin-top: 15px; color: grey;">
                                Hmm... there seem to be no available plugins
                                for this contract type yet.
                            </li>
                        `
                }
            </ul>

        `;
    }
}
