import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MinMaxLength } from "@lion/form-core";
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { 
    KanaForm, KanaSelect, KanaInput, Required, 
    formCssCommon, maxLengthPreprocessor 
} from '../components/forms/forms';
import { ModuleForm, ModuleParams } from '../components/modules/commons';
import { KanaloaAPI } from '../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../components/windowlet';
import { BASIC_MODULES, getAllModules } from '../components/modules/modules-list';
import { headerStyles } from '../components/common-styles';
import { eventHandler, handlerSetup } from '../utils/event-handler';
import { when } from 'lit/directives/when.js';
import KanaloaAddressBook from "kanaloa-address-book.json";
import { Contract, ethers } from 'ethers';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { ModuleParameters } from 'src/api/kanaloa-project-registry';
import { ModulesWindowlet } from '../components/modules/modules-windowlet';
import '../components/modules/modules-windowlet';


@customElement('contract-page')
export class ContractPage extends LitElement {

    @property({ type: String })
    declare projectName: string;
    @property({ type: String })
    declare projectAddress: string;
    @property({ type: String })
    declare contract: string | undefined;
    @property({ type: String })
    declare contractName: string | undefined;
    @property({ type: Boolean })
    declare expandedMode: boolean;

    @state()
    declare selectedBaseModule: ModuleParams;
    @state()
    declare modulesList: Ref<ModulesWindowlet>;
    @state()
    declare formWindowlet: Ref<KanaloaWindowlet>;
    @state()
    declare newContractBaseWindowlet: Ref<ContractBaseWindowlet>;

    declare basicModules: ModuleParams[];
    declare allModules: ModuleParams[];

    constructor() {
        super();
        this.basicModules = BASIC_MODULES;
        this.allModules = getAllModules();
        this.modulesList = createRef();
        this.formWindowlet = createRef();
        this.newContractBaseWindowlet = createRef();
        handlerSetup(this);
        loadDefaultFeedbackMessages();
    }

    static get styles() {
        return [
            headerStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 1rem;
                    flex: 1 1 0%;
                }

                .expanded {
                    flex: 1 1 max-content;
                }

                kana-form {
                    width: 100%;
                    height: 100%;
                }
        
                kana-form > form {
                    display: flex;
                    flex: 0 1 max-content;
                    margin: 0 auto;
                    transition: flex 0.1s;
                    gap: 1rem;
                    height: 100%;
                }
                
                .contract-overview-group {
                    display: flex;
                    flex-flow: column wrap;
                    gap: 1rem;
                }
            `
        ];
    }

    async submitHandler(ev: Event) {
        const modules: ModuleForm[] = 
            this.modulesList.value?.selectedModules || [];

        if (modules.length == 0) {
            // Technically unreachable under regular circumstances
            console.log("How did you get here?");
        }

        const root: any = 
            this.newContractBaseWindowlet.value?.formBase.value?.modelValue;
        const genesisModules: ModuleParameters[] = [];
        for (const form of modules) {
            root[form.moduleSignature] = form.modelValue;
        }
        for (const form of modules) {
            const compiledModule = await form.compileModuleParameters(root);
            if (compiledModule == null) {
                return;
            }
            genesisModules.push(compiledModule);
        }

        const kanaToken: Contract = new Contract(
            KanaloaAddressBook.KANA, [ 
                "function allowance(address owner, address spender) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)"
            ], await KanaloaAPI.signer!
        );

        const hasAllowance: bigint = 
            await kanaToken.allowance(
                KanaloaAPI.signer, 
                KanaloaAddressBook.PaymentsProcessor
            );

        if (hasAllowance < BigInt(ethers.parseUnits("320000"))) {
            await (
                await kanaToken.approve(
                    KanaloaAddressBook.PaymentsProcessor, 
                    ethers.parseUnits("320000")
                )
            ).wait();
        }

        KanaloaAPI.projectRegistry.newContract({
              name: root.name,
              project: this.projectName,
              genesisModules: genesisModules,
              payment: KanaloaAddressBook.KANA
        });
        
    }

    @eventHandler("submit-form", { capture: true })
    captureSubmit() {
        this.shadowRoot!.querySelector("kana-form")!.dispatchEvent(new Event("submit"))
    }
    

    @eventHandler("base-selected", { once: true })
    expandForm(ev: Event) {
        this.expandedMode = true;
    }

    @eventHandler("base-selected", { capture: true })
    baseTypeSelected(ev: CustomEvent) {
        const selected: ModuleParams = ev.detail.contractType;
        this.selectedBaseModule = selected;
    }

    @eventHandler("selected-modules-updated", { capture: true })
    selectedModulesUpdated(ev: CustomEvent) {
        // TODO: recalc price
        this.requestUpdate();
    }

    render() {
        console.log(this.modulesList.value?.selectedModules);
        return html`
            ${
                when(
                    !this.expandedMode,
                    () => html`
                        <h1 id="page-title">
                            New contract for ${this.projectName}
                        </h1>
                    `
                )

            }
            <kana-form @submit=${this.submitHandler}>
                <form 
                    @submit=${(ev: Event) => ev.preventDefault()}
                    class="${this.expandedMode ? "expanded" : ""}"
                >
                    <div class="contract-overview-group">
                        <kana-fieldset name="base-module-config">
                            <contract-base-windowlet 
                                ${ref(this.newContractBaseWindowlet)}
                                .moduleList=${this.basicModules}
                                contract="${this.contract}"
                                .selectedBaseModule=${this.selectedBaseModule}
                                name="${(this.contractName != null) ? this.contractName : ""}"
                            >
                            </contract-base-windowlet>
                        </kana-fieldset>
                        ${
                          (this.expandedMode) ?
                            html`
                                <modules-windowlet
                                    ${ref(this.modulesList)}
                                    .baseModule=${this.selectedBaseModule}
                                >
                                </modules-windowlet>
                            ` : ""
                        }
                    </div>
                    ${
                        (this.expandedMode) ?
                            html`
                                <kana-windowlet ${ref(this.formWindowlet)}>
                                    ${
                                        
                                        this.modulesList.value?.selectedModules
                                            .map((x) => html`<div>${x}</div>`)
                                    }
                                </kana-windowlet>
                            ` : null
                    }
                </form>
            </kana-form>
        `;
    }
}

@customElement('contract-base-windowlet')
export class ContractBaseWindowlet extends KanaloaWindowlet {
    static formAssociated = true;

    @property({ type: String })
    declare name: string;
    @property({ type: String })
    declare contract: string;
    
    @state()
    declare moduleList: ModuleParams[];

    @state()
    declare selectedBaseModule: ModuleParams;

    @state()
    declare formBase: Ref<KanaForm>;

    constructor() {
        super();
        this.formBase = createRef();
    }

    connectedCallback(): void {
        super.connectedCallback();

    }

    static get styles() {
        return [
            ...super.styles,
            ...formCssCommon
        ]
    }

    selectContractType(ev: Event) {
        const selected = (ev.target as KanaSelect).value;
        this.selectedBaseModule = this.moduleList.find((m) => m.value == selected)!;
        this.dispatchEvent(
            new CustomEvent(
                "base-selected", 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        contractType: this.selectedBaseModule
                    }
                }
            )
        );

    }

    render() {
        return html`
            <kana-form ${ref(this.formBase)}>
                <form>
                    <h2 id="contract-title">
                        ${
                            (this.name == null || this.name == "") ? 
                                "New contract" : this.name
                        }
                    </h2>
                    <hr />
                    <label>Project info</label>
                    <div class="form-row">
                        <kana-input
                            label-sr-only="Contract name"
                            placeholder="Contract name"
                            name="name"
                            .validators="${[
                                new MinMaxLength({ min: 4, max: 16}),
                                new Required()
                            ]}"
                            .preprocessor=${maxLengthPreprocessor(16)}
                            @input=${(ev: Event) => this.name = (ev.target as KanaInput).value}
                        ></kana-input>
                        <kana-select
                            label-sr-only="Contract type"
                            name="type"
                            placeholder="Contract type"
                            class="small-input"
                            .validators=${[ new Required() ]}
                            @change=${this.selectContractType}
                            .modelValue=${
                                this.selectedBaseModule?.value
                            }
                            disabled=${this.contract || nothing }
                        >
                            <select name="type-select" slot="input">
                                <option hidden selected value>
                                    Select type
                                </option>
                                ${repeat(
                                    this.moduleList, 
                                    (k: any) => k.value, 
                                    (item: any) => {
                                        return html`
                                            <option
                                                name="${item.name}"
                                                value="${item.value}"
                                            >
                                                ${item.name}
                                            </option>
                                        `;
                                    }
                                )}
                            </select>
                        </kana-select>
                    </div>
                    <div class="form-row">
                        <kana-button-submit @click=${
                            () => this.dispatchEvent(
                                new CustomEvent(
                                    'submit-form', 
                                    { bubbles: true, composed: true }
                            )
                        )}>
                            ${
                                (this.contract) ?
                                    "Update" : "Deploy new contract (320000 $KANA)"
                            }
                        </kana-button-submit>
                    </div>
                </form>
            </kana-form>
        `;
    }
}

