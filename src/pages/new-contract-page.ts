import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import "../components/forms/forms";
import "../components/windowlet";
import { MinMaxLength } from "@lion/form-core";
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { 
    KanaForm, KanaSelect, KanaInput, Required, 
    formCssCommon, maxLengthPreprocessor 
} from '../components/forms/forms';
import { ModuleForm, ModuleParams } from '../components/modules/commons';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../components/windowlet';
import { getBasicModules, getAllModules } from '../components/modules/modules-list';
import { headerStyles } from '../components/common-styles';
import { eventHandler, handlerSetup } from '../utils/event-handler';
import { when } from 'lit/directives/when.js';

@customElement('new-contract-page')
export class NewContractPage extends LitElement {

    @property({ type: String })
    declare name: String;
    @property({ type: String })
    declare address: string;
    @property({ type: Boolean })
    declare expandedMode: boolean;

    @state()
    declare selectedBaseModule: ModuleParams;
    @state()
    declare selectedForm: ModuleForm;


    declare basicModules: ModuleParams[];
    declare allModules: ModuleParams[];

    constructor() {
        super();
        this.basicModules = getBasicModules();
        this.allModules = getAllModules();
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
        let form: KanaForm = ev.target as KanaForm;
        console.log(form)
        if (form.hasFeedbackFor.includes('error')) {
          const firstFormElWithError = form.formElements.find(
                (el: any) => el.hasFeedbackFor.includes('error'),
          );
          firstFormElWithError.focus();
          return;
        }
        const formData = form.modelValue;

        GlobalKanaloaEthers.projectRegistry.newProject({
            projectName: formData.name,
            abbreviation: formData.abbreviation,
            description: formData.description,
            visibility: 0
        });
        // fetch('/api/foo/', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        // });
    }

    @eventHandler("submit-form", { capture: true })
    captureSubmit() {
        this.shadowRoot!.querySelector("kana-form")?.dispatchEvent(new Event("submit"))
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

    @eventHandler("tab-changed", { capture: true })
    moduleTabSelected(ev: CustomEvent) {
        const moduleInfo = ev.detail.tabInfo;
        const instance =
            (moduleInfo.instance) ? 
                moduleInfo.instance : 
                document.createElement(moduleInfo.customElement);
        this.selectedForm = instance;
    }

    render() {
        return html`
            ${
                when(
                    !this.expandedMode,
                    () => html`
                        <h1 id="page-title">
                            New contract for ${this.name}
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
                            <new-contract-base-windowlet
                                .moduleList=${this.basicModules}
                            >
                            </new-contract-base-windowlet>
                        </kana-fieldset>
                        ${
                          (this.expandedMode) ?
                            html`
                                <modules-windowlet 
                                    .baseModule=${this.selectedBaseModule}
                                    .moduleList=${this.allModules}
                                >
                                </modules-windowlet>
                            ` : ""
                        }
                    </div>
                    ${
                        (this.selectedForm) ?
                            html`
                                <kana-windowlet>
                                    ${this.selectedForm}
                                </kana-windowlet>
                            ` : null
                    }
                </form>
            </kana-form>
        `;
    }
}

@customElement('new-contract-base-windowlet')
export class NewContractBaseWindowlet extends KanaloaWindowlet {
    static formAssociated = true;

    @property({ type: String })
    declare name: string;
    
    declare moduleList: ModuleParams[];

    constructor() {
        super();

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
        this.dispatchEvent(
            new CustomEvent(
                "base-selected", 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        contractType: selected
                    }
                }
            )
        );

        this.dispatchEvent(
            new CustomEvent(
                "tab-changed", 
                {
                    bubbles: true,
                    composed: true,
                    detail: {
                        tabInfo: 
                            this.moduleList.find(
                                (x) => x.value == selected
                            ) as ModuleParams
                    }
                }
            )
        );

        // const moduleData = 
        //     this.basicModules.find((module) => module.value == selected);
        // if (moduleData == null) {
        //     return;
        // }

        // console.log(document.getElementById("type-specific-config"))
        // this.querySelector("#type-specific-config")?.append(new moduleData.form())
        // We should asyncronously load the module-specific form data here
        // Or not, because lazy loading components sucks
    }

    render() {
        return html`
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
                >
                    <select name="type-select" slot="input">
                        <option hidden selected>
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
                <kana-button-submit>
                    Deploy new project
                </kana-button-submit>
            </div>
        `;
    }
}

@customElement('modules-windowlet')
export class ModulesWindowlet extends KanaloaWindowlet {

    @property({ type: String })
    declare baseModule: string;

    declare moduleList: ModuleParams[];

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
            `
        ];
    }

    constructor() {
        super();
    }

    private onClickRadioHandler(ev: Event) {
        const radio: HTMLInputElement = 
            (ev.currentTarget as HTMLLIElement).querySelector("input")!;
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
    }

    private radioHandlerChanged(ev: Event) {
        this.dispatchEvent(
            new CustomEvent(
                "tab-changed", 
                {
                    bubbles: true,
                    composed: true,
                    detail: {
                        tabInfo: (ev.currentTarget as any).moduleInfo
                    }
                }
            )
        );
    }

    render() {
        // NOTE: there are better ways to do this, but this is quick and
        // serviceable
        const baseModuleParams: ModuleParams = 
            this.moduleList.find(
                (x) => x.value == this.baseModule
            ) as ModuleParams;
        const otherModules: ModuleParams[] =
            this.moduleList.filter(
                // Checking by reference
                (x) => getAllModules().includes(x)
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
                        @change=${this.radioHandlerChanged}
                        checked 
                    />
                    ${baseModuleParams.name}
                </li>
                ${
                    repeat(
                        otherModules, 
                        (x) => html`
                            <li @click=${this.onClickRadioHandler}>
                                <input type="radio"
                                    name="_selectedModule"
                                    value="${x.value}"
                                    .moduleInfo=${x}
                                    @change=${this.radioHandlerChanged}                        
                                />
                                ${x.name}
                            </li>
                        `
                    )
                }
            </ul>

        `;
    }
}
