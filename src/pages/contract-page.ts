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
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { ModuleOps, ModuleParameters } from 'src/api/kanaloa-project-registry';
import { ModulesWindowlet } from '../components/modules/modules-windowlet';
import '../components/modules/modules-windowlet';
import { TaxableOperations } from '../api/payments-processor';
import { until } from 'lit/directives/until.js';
import { Router } from '@vaadin/router';


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
    declare price: Promise<number | undefined>;
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
        this.price = new Promise((res) => res(undefined));
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
        if (!this.expandedMode) {
            return;
        }
        const modules: ModuleForm[] = 
            Array.from(
                this.modulesList.value?.getSelectedModules().values()!
            ) || [];

        if (modules.length == 0) {
            // Technically unreachable under regular circumstances
            console.log("How did you get here?");
        }

        const use = (this.contract === undefined) ? 
                (ops: any) => () =>
                    KanaloaAPI.projectRegistry.newContract({
                        name: this.getRoot().name,
                        project: this.projectName,
                        genesisModules: ops as ModuleParameters[],
                        payment: KanaloaAddressBook.KANA
                    }) :
                (ops: any) => () => 
                    KanaloaAPI.projectRegistry.modifyContract({
                        project: this.projectName,
                        target: this.contract!,
                        moduleOperations: ops as [ModuleOps, ModuleParameters][],
                        payment: KanaloaAddressBook.KANA
                    });

        this.compile()
            .then((ops) => { 
                if (ops == null || ops.length == 0) {
                    throw new Error("Attempting to execute a no-op");
                }

                this.getInvoice(ops!)
                    .then((invoice) => {
                        if (invoice) {
                            return KanaloaAPI.paymentsProcessor
                                .requestAllowance(invoice)
                        }
                        throw new Error("Invoice is undefined")
                    })
                    .then((allowance) => {
                        if (allowance) {
                            return true;
                        }
                        throw new Error("Allowance request rejected")
                    })
                    .then(
                        use(ops)
                    )
                    .then(
                        () => Router.go(`/projects/${this.projectAddress}`)
                    )
                    .catch(console.error)
                })
            .catch(console.error)
    }

    @eventHandler("submit-form", { capture: true })
    captureSubmit() {
        this.shadowRoot!
            .querySelector("kana-form")!
            .dispatchEvent(new Event("submit"))
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
        this.requestUpdate();
        setTimeout(() => this.recalculatePrice(), 0);
    }

    @eventHandler("payload-modified", { capture: true })
    recalculatePrice(ev?: CustomEvent) {
        this.price = this.compile(false)
            .then((ops) => {
                if (ops == null) {
                    throw new Error("Could not generate payload")
                }
                return this.getInvoice(ops);
            })
            .then((price) => {
                if (price == null) {
                    throw new Error("Could not calculate price")
                }

                return Number(price / 10n ** 18n);
            })
    }

    async getInvoice(
        operations: ModuleParameters[] | [ModuleOps, ModuleParameters][]
    ) {
        return await KanaloaAPI.paymentsProcessor.calculateInvoice(
            (this.contract) ? 
                TaxableOperations.EDIT_CONTRACT : 
                TaxableOperations.NEW_CONTRACT,
            {
                target: this.projectAddress,
                payload: operations,
                token: KanaloaAPI.KANA_TOKEN,
                client: await (await KanaloaAPI.signer)!.getAddress()!
            }
        );
    }

    getRoot() {
        const base = 
            this.newContractBaseWindowlet.value?.formBase.value?.modelValue;
        this.modulesList.value?.getSelectedModules().forEach(
            (v, k) => base[k] = v.modelValue
        );

        return base;
    }

    async compile(strict: boolean = true) {
        const root = this.getRoot();
        return this.modulesList.value?.compile(root, strict);        
    }

    render() {
        const forms = this.modulesList.value?.getSelectedModules().values();
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
                                .price=${this.price}
                                name="${
                                    (this.contractName != null) ? 
                                        this.contractName : ""
                                }"
                            >
                            </contract-base-windowlet>
                        </kana-fieldset>
                        ${
                          (this.expandedMode) ?
                            html`
                                <modules-windowlet
                                    ${ref(this.modulesList)}
                                    .baseModule=${this.selectedBaseModule}
                                    contractAddress="${this.contract}"
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
                                        Array.from(forms || [])
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
    declare price: Promise<number | undefined>;
    @state()
    declare moduleList: ModuleParams[];
    @state()
    declare selectedBaseModule: ModuleParams;
    @state()
    declare formBase: Ref<KanaForm>;
    

    constructor() {
        super();
        this.formBase = createRef();
        this.price = new Promise((res) => res(undefined));
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    static get styles() {
        return [
            ...super.styles,
            ...formCssCommon,
            css`
                span {
                    margin-left: 10px;
                    line-height: 1em;
                }
                
                kana-icon {
                    font-size: 1.4em;
                }

                loading-icon {
                    margin-left: 10px;
                }
            `
        ]
    }

    selectContractType(ev: Event) {
        const selected = (ev.target as KanaSelect).value;
        this.selectedBaseModule = 
            this.moduleList.find((m) => m.signature == selected)!;
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
        const preliminaryCost = until(
            this.price.then((price) => {
                return html`
                    <span>
                        ${
                            (price != undefined) ? 
                                `(${price} $KANA)` :
                                html`<kana-icon>pending</kana-icon>`
                        }
                    </span>
                `;
            }).catch((e) => {
                console.error(e);
                return html`<kana-icon>error</kana-icon>`
            }),
            html`<loading-icon size="1.4em"></loading-icon>`
        );
        const buttonContents = 
            (this.contract) ? 
                html`Update ${this.name}` : "Deploy new contract";
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
                            id="root-name-input"
                            label-sr-only="Contract name"
                            placeholder="Contract name"
                            name="name"
                            .validators="${[
                                new MinMaxLength({ min: 4, max: 16}),
                                new Required()
                            ]}"
                            .preprocessor=${maxLengthPreprocessor(16)}
                            @input=${
                                (ev: Event) => 
                                    this.name = (ev.target as KanaInput).value
                            }
                        ></kana-input>
                        <kana-select
                            label-sr-only="Contract type"
                            name="type"
                            placeholder="Contract type"
                            class="small-input"
                            .validators=${[ new Required() ]}
                            @change=${this.selectContractType}
                            .modelValue=${
                                this.selectedBaseModule?.signature
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
                                    (item: ModuleParams) => {
                                        return html`
                                            <option
                                                name="${item.name}"
                                                value="${item.signature}"
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
                        <kana-button-submit 
                            @click=${
                                () => this.dispatchEvent(
                                    new CustomEvent(
                                        'submit-form', 
                                        { bubbles: true, composed: true }
                                    )
                                )
                            }
                            disabled=${
                                this.selectedBaseModule == null || nothing
                            }
                        >
                            ${buttonContents}${preliminaryCost}
                        </kana-button-submit>
                    </div>
                </form>
            </kana-form>
        `;
    }
}

