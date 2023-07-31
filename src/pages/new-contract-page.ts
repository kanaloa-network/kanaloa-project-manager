import { LitElement, html, css } from 'lit';
import { customElement, eventOptions, property } from 'lit/decorators.js';
import "../components/forms";
import "../components/windowlet";
import "@lion/fieldset";
import { MinMaxLength } from "@lion/form-core";
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { 
    KanaForm, KanaSelect, Required, formCssCommon, maxLengthPreprocessor 
} from '../components/forms';
import { ModuleParams } from '../components/modules/commons';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../components/windowlet';
import { ERC20Form } from '../components/modules/erc20-form';
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

    constructor() {
        super();    
        this.expandedMode = false;
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
                    flex: 1;
                }

                .expanded {
                    flex: 1 1 max-content;
                }

                kana-form {
                    width: 100%;
                }
        
                kana-form > form {
                    display: flex;
                    flex: 0 1 max-content;
                    margin: 0 auto;
                    transition: flex 0.1s;
                    gap: 1rem;
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

    @eventHandler("base-selected", { once: true })
    expandForm(ev: Event) {
        this.expandedMode = true;
    }

    @eventHandler("base-selected", { capture: true })
    baseTypeSelected(ev: Event) {
        const selected: string = (ev.target as KanaSelect).value;
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
            <kana-form @submit="${this.submitHandler}">
                <form 
                    @submit=${(ev: Event) => ev.preventDefault()}
                    class="${this.expandedMode ? "expanded" : ""}"
                >
                    <div class="contract-overview-group">
                        <lion-fieldset name="base-module-config">
                            <new-contract-base-windowlet>
                            </new-contract-base-windowlet>
                        </lion-fieldset>
                        ${
                          (this.expandedMode) ?
                            html`
                                <modules-installed-windowlet
                                    class="${this.expandedMode ? "expanded" : ""}"
                                >
                                </modules-installed-windowlet>
                            ` : ""
                        }
                    </div> 
                </form>
            </kana-form>
        `;
    }
}

@customElement('new-contract-base-windowlet')
export class NewContractBaseWindowlet extends KanaloaWindowlet {

    basicModules: ModuleParams[];

    constructor() {
        super();

        this.basicModules = [
            { name: "ERC20", value: "erc20", form: ERC20Form },
            { name: "ERC721", value: "erc721", form: LitElement }
        ];
    }

    static get styles() {
        return [
            ...super.styles,
            ...formCssCommon
        ]
    }

    selectContractType(ev: Event) {
        this.dispatchEvent(
            new CustomEvent(
                "base-selected", 
                { bubbles: true, composed: true }
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
            <h2 id="contract-title">New contract</h2>
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
                            this.basicModules, 
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
            <lion-fieldset
                id="type-specific-config"
                name="type-specific-config" 
                class="form-row" 
            >
            </lion-fieldset>
            <div class="form-row">
                <kana-button-submit>
                    Deploy new project
                </kana-button-submit>
            </div>
        `;
    }
}

@customElement('modules-installed-windowlet')
export class ModulesInstalledWindowlet extends KanaloaWindowlet {
    constructor() {
        super();
    }

    render() {
        return html`hello world`;
    }
}
