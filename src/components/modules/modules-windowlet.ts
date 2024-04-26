import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ModuleForm, ModuleParams } from './commons';
import { KanaloaAPI } from '../../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../../components/windowlet';
import { BasicModule, BASIC_MODULES, PLUGIN_MODULES } from './modules-list';
import { Contract, ethers } from 'ethers';
import { until } from 'lit/directives/until.js';
import { ModuleOps, ModuleParameters } from '../../api/kanaloa-project-registry';

@customElement('modules-windowlet')
export class ModulesWindowlet extends KanaloaWindowlet {

    @state()
    declare baseModule: ModuleParams;
    @state()
    declare onchainModules: Record<string, [string, ethers.BytesLike]>;
    @state()
    declare stateRecords: Record<string, boolean>;
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
                
                loading-icon {
                    flex: 0 !important;
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
        this.onchainModules = {};
        this.stateRecords = {};
        this.contract = new Promise((res) => res(undefined));
    }

    attributeChangedCallback(
        name: string, _old: string | null, value: string | null
    ): void {
        super.attributeChangedCallback(name, _old, value);

        if (name != "contractaddress" || _old == value) {
            return;
        }

        if (value) {
            this.contract = new Promise(
                (res) => res(
                    new Contract(
                        value, [ 
                            "function getActiveModule(" 
                                + "bytes32 signature"
                            + ") view returns (address)",
                            "function peek("
                                + "bytes32 signature"
                            + ") view returns (bytes memory)"
                        ], KanaloaAPI.wallet
                    )
                ));
        } else {
            this.contract = new Promise((res) => res(undefined));
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.moduleListChanged();
    }

    private onClickRadioHandler(ev: Event) {
        const radio: HTMLInputElement = 
            (ev.currentTarget as HTMLLIElement).querySelector("input")!;
        radio.checked = true;
        radio.dispatchEvent(new Event("change-module"));
    }

    moduleListChanged(e?: Event) : void {
        if (e && e.target) {
            const elem = (e.target as HTMLInputElement);
            this.stateRecords[elem.value] = elem.checked || false;
        }
        this.getSelectedModules();
        this.dispatchEvent(
            new CustomEvent(
                "selected-modules-updated", 
                { bubbles: true, composed: true }
            )
        );
        this.requestUpdate();
    }
    
    getModuleForm(mod: ModuleParams) {
        if (this.formCache[mod.signature] == null) {
            const form =
                document.createElement(mod.customElement) as ModuleForm;            
            this.formCache[mod.signature] = form;
        }
        
        return this.formCache[mod.signature];
    }

    getSelectedModules(): Map<string, ModuleForm> {
        const selectedModules: ModuleParams[] = [ 
            BASIC_MODULES.find(
                (x) => x.signature == this.baseModule.signature
            )!,
            ...(
                Array.from(
                    this.shadowRoot?.querySelectorAll(
                        "input.module-enable[type='checkbox']:checked"
                    ) || []
                ).map(
                    (x) => 
                        PLUGIN_MODULES[this.baseModule.signature]
                            .find((y) => 
                                y.signature == x.getAttribute("value")
                            )!
                )
            )
        ];
        
        const modules = new Map<string, ModuleForm>();
        for (let i = 0; i < selectedModules.length; i++) {
            const mod = selectedModules[i];
            const form = this.getModuleForm(mod);
            modules.set(mod.signature, form);
            form.setParent(modules.values().next().value);
        }

        return modules;
    }

    async scanModule(
        sig: string
    ): Promise<[string, ethers.BytesLike] | undefined> {
        // We probe the associated contract to check if a module is marked as
        // installed in the contract, and if it is, we execute "peek" over it
        const contract = await this.contract;
        if (contract == null) {
            delete this.onchainModules[sig];
            return [ethers.ZeroAddress, ""];
        }

        const implementation: string = await contract.getActiveModule(sig);
        if (implementation != ethers.ZeroAddress) {
            this.onchainModules[sig] = 
                [implementation,  await contract.peek(sig)];
        } else {
            delete this.onchainModules[sig];
        }

        const form = this.formCache[sig];
        const onchain = this.onchainModules[sig];
        if (
            form != null && 
            onchain != null && 
            form.loadedRawData != onchain[1]
        ) {
            form.load(onchain[1]);
        }

        if (
            this.stateRecords[sig] === undefined &&
            implementation != ethers.ZeroAddress
        ) {
            this.stateRecords[sig] = true;
            this.moduleListChanged();
        }

        return onchain;
    }

    moduleEntry(params: ModuleParams, basic: boolean = false) {
        const scan = this.scanModule(params.signature);
        const genCheckbox = (loading: boolean) => {
            return html`
                <input type="checkbox"
                    class="module-enable"
                    name="${params.signature}-enable"
                    value="${params.signature}"
                    ?checked=${
                        this.stateRecords[params.signature]
                    }
                    @change=${this.moduleListChanged}
                    ?hidden=${loading}
                />
            `
        }
        return html`
            <li 
                class=${basic ? "base-module" : nothing}
                @click=${this.onClickRadioHandler}
            >
                <input type="radio"
                    name="_selectedModule"
                    value="${params.signature}"
                    .moduleInfo=${params}
                    ?checked=${basic}
                />
                <label 
                    for="${(basic) ? nothing : params.signature}-enable"
                >
                    ${params.name}
                </label>
                ${
                    (basic) ? "" :  until(
                        scan.then(() => genCheckbox(false)),
                        html`
                            <loading-icon size="1.2em"></loading-icon>
                            ${genCheckbox(true)}
                        `
                    )
                }
            </li>
        `;

    }

    async compile(root: any, strict: boolean = true): 
        Promise<ModuleParameters[] | [ModuleOps, ModuleParameters][]> {
        // Retrieve info about the current status of the forms and
        // compute a delta with what's onchain
        // REMEMBER: the payload inside of TaxablePayload will be formatted
        // as [signature: bytes32, initData: bytes] or 
        // [ModuleOps, [signature: bytes32, initData: bytes]] depending on
        // whether the contract is new or we are editing an already existing
        // contract (because new contracts can only INSTALL). We will cheat
        // a bit and just strip the operation away at the end.
        const payload: [ModuleOps, ModuleParameters][] = [];
        const selected = this.getSelectedModules(); // get'em fresh
        
        // First, find all uninstalled modules
        Object.entries(this.onchainModules).forEach((v) => {
            if (selected.get(v[0]) == null) {
                // Seems like the module was deleted. Add to the list
                // Uninstall operations should not accept initData, so
                // we leave that empty
                payload.push([
                    ModuleOps.UNINSTALL, 
                    { moduleSignature: v[0], initParams: "0x" }
                ]);
            }
        });

        const list = Array.from(selected.entries());
        for (let i = 0; i < list.length; i++) {
            const [s, f] = list[i];
            const upstreamData = this.onchainModules[s];
            const data = await f.compileModuleParameters(root);
            if (data == null) {
                if (strict) {
                    throw new Error("Errors in form");
                }
                continue;
            }

            if (upstreamData == null) {
                // The module has to be a new installation
                payload.push(
                    [ModuleOps.INSTALL, data]
                );
                continue;
            }
            
            if (!f.asUpstream(data.initParams)) {
                // The module params have changed. Add as REINITIALIZE
                payload.push(
                    [ModuleOps.REINITIALIZE, data]
                );
                continue;
            }
            // TODO: handle UPGRADE
        }

        return (await this.contract != null) ? 
            payload : payload.map((p) => p[1])
        ; 
    }

    render() {
        // NOTE: there are better ways to do this, but this is quick and
        // serviceable
        const baseModuleParams: ModuleParams = 
            BASIC_MODULES.find(
                (x) => x.signature == this.baseModule.signature
            ) as ModuleParams;
        const otherModules: ModuleParams[] =
            PLUGIN_MODULES[this.baseModule.signature] || [];
        const availableModules = 
            repeat(otherModules, (x) => this.moduleEntry(x));

        return html`
            <ul>
                ${this.moduleEntry(baseModuleParams, true)}
                ${
                    (otherModules.length != 0) && (this.contractAddress !== "")
					?
                        availableModules
					:
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
