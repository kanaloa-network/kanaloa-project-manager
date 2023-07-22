import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import "../components/forms"
import "../components/windowlet"
import "@lion/fieldset";
import { MinMaxLength, Required } from "@lion/form-core"
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { KanaForm, KanaSelect, maxLengthPreprocessor } from '../components/forms';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { repeat } from 'lit/directives/repeat.js';
import { KanaloaWindowlet } from '../components/windowlet';

const cssCommon = [
    css`
        h1 {
            font-size: 3rem;
            display: block;
            width: 100%;
        }

        h2 {
            font-size: 2rem;
            margin: 0.5rem 0 0.5rem;
        }

        h3 {
            font-size: 1.5rem;
            margin: 0;
        }

        hr {
            border: none;
            height: 2px;
            background-color: var(--background-light-color);
            margin: 0.5rem 0 1rem;
        }

        kana-input, input, kana-select {
            flex: 1;
            font-size: 1rem;
            position: relative;
        }

        input, select {
            font-family: sans;
        }

        input {
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--primary-color);
            color: var(--foreground-color);
            box-sizing: border-box;
        }
        
        input:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--highlighted-light-color);
        }

        .small-input, .small-input * {
            flex: 0;
        }

        .small-input input {
            width: 8rem;
        }

        .form-row {
            display: flex;
            gap: 1rem;
            margin: 10px 0;
            flex-flow: row wrap;
        }

        select {
            padding: 10px;
            padding-right: 2rem;
            border: none;
            border-radius: 5px;
            background-color: var(--primary-color);
            color: var(--foreground-color);
            font-size: 1rem;
            appearance: none;
            cursor: pointer;
            flex: 1;
        }
        
        select:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--highlighted-light-color);
        }
        
        kana-button-submit {
            min-width: fit-content;
            flex: 1;
            font-size: 1.2rem;
            min-height: 3rem;
        }
    `,
    // There has to be a better place to put this, but I will figure 
    // that out later
    css`
        .form-row lion-validation-feedback {
            position: absolute;
            background-color: var(--highlighted-light-color);
            color: var(--background-color);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
            max-width: 12rem;
            font-size: 0.8rem;
            line-height: 1.2;
            bottom: 2rem;
            margin-left: -3rem;
            width: max-content;
            z-index: 1
        }

        .form-row lion-validation-feedback:not([type="error"]) {
            display: none;
        }
        
        .form-row lion-validation-feedback::before {
            content: '';
            position: absolute;
            bottom: -18px;
            left: 10%;
            margin-left: -10px;
            border: 10px solid transparent;
            border-top: 15px solid var(--highlighted-light-color);
        }
        
    `
];

@customElement('new-contract-page')
export class NewContractPage extends LitElement {

    @property({ type: String })
    declare name: String;
    @property({ type: String })
    declare address: string;
    @property({ type: Array })
    declare basicModules: { name: string, value: string}[];

    constructor() {
        super();
        
        this.basicModules = [
            { name: "ERC20", value: "erc20" },
            { name: "ERC721", value: "erc721" }
        ];

        loadDefaultFeedbackMessages();
        Required.getMessage = async () => {
            return "Please, enter a value";
        }
    }

    static get styles() {
        return [
            ...cssCommon,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 1rem;
                    flex: 1;
                }

                .form-expanded {
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

    selectContractType(ev: Event) {
        const selected: string = (ev.target as KanaSelect).value;
        const form = 
            (ev.target as HTMLElement).closest("form") as HTMLFormElement;
        if (form.classList.contains("form-expanded")) {
            return;
        }
        form.classList.add("form-expanded");
        // We should asyncronously load the module-specific form data here
        // Or not, because lazy loading components sucks
    }

    render() {
        return html`
            <h1 id="page-title">New contract for ${this.name}</h1>
            <kana-form @submit="${this.submitHandler}">
                <form @submit=${(ev: Event) => ev.preventDefault()}>
                    <lion-fieldset name="base-module-config">
                        <kana-windowlet>
                            <h2>New contract</h2>
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
                                        <option 
                                            hidden
                                            selected
                                            value
                                        >
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
                                hidden
                            >

                            </lion-fieldset>
                            <div class="form-row">
                                <kana-button-submit>
                                    Deploy new project
                                </kana-button-submit>
                            </div>
                        </kana-windowlet>
                    </lion-fieldset> 
                </form>
            </kana-form>
        `;
    }
}

@customElement('modules-installed-windowlet')
export class ModulesInstalledWindowlet extends KanaloaWindowlet {

}
