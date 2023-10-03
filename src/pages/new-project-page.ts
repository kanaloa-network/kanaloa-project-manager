import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import "../components/forms/forms"
import "../components/windowlet"
import { MinMaxLength, Required } from "@lion/form-core"
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { KanaForm, maxLengthPreprocessor } from '../components/forms/forms';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';

@customElement('new-project-page')
export class NewProjectPage extends LitElement {

    constructor() {
        super();
        loadDefaultFeedbackMessages();
        Required.getMessage = async () => {
            return "Please, enter a value";
        }
    }

    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 1rem;
                    flex: 1 1 0%;
                }

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

                kana-windowlet {
                    max-width: 32rem;
                    flex: 0 1 auto;
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
    }

    async submitHandler(ev: any) {
        let form: KanaForm = ev.target;
        if (form.hasFeedbackFor.includes('error')) {
          const firstFormElWithError = form.formElements.find(
                (el: any) => el.hasFeedbackFor.includes('error'),
          );
          firstFormElWithError.focus();
          return;
        }
        const formData = ev.target.modelValue;

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
      };

    render() {
        return html`
            <h1>New Project</h1>
            <kana-windowlet>
                <h2>New project</h2>
                <h3>Begin your journey</h3>
                <hr />
                <label>Project info</label>
                <kana-form @submit="${this.submitHandler}">
                    <form @submit=${(ev: Event) => ev.preventDefault()}>
                        <div class="form-row">
                            <kana-input
                                label-sr-only="Name"
                                placeholder="Name"
                                name="name"
                                .validators="${[
                                    new MinMaxLength({ min: 4, max: 16}),
                                    new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(16)}
                            ></kana-input>
                            <kana-input
                                label-sr-only="Abbreviation"
                                placeholder="Abbreviation"
                                name="abbreviation"
                                class="small-input"
                                .validators="${[
                                    new MinMaxLength({ min: 2, max: 8}),
                                    new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(8)}
                            ></kana-input>
                        </div>
                        <div class="form-row">
                            <kana-input
                                label-sr-only="Description"
                                placeholder="Description (maximum 64 characters)"
                                name="description"
                                .validators="${[
                                    new MinMaxLength({ min: 0, max: 64}),
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(64)}
                            ></kana-input>
                        </div>
                        <div class="form-row">
                            <kana-select
                                label-sr-only="Visibility"
                                name="visibility"
                                placeholder="Visibility"
                                .validators=${[ new Required() ]}
                            >
                                <select name="visibility-select" slot="input">
                                    <option 
                                        hidden
                                        selected
                                        value=""
                                    >
                                        Visibility
                                    </option>
                                    <option 
                                        name="public" 
                                        value="public">
                                        Public
                                    </option>
                                    <option 
                                        name="unlisted" 
                                        value="unlisted">
                                        Unlisted
                                    </option>
                                </select>
                            </kana-select>
                        </div>
                        <div class="form-row">
                            <kana-button-submit>
                                Deploy new project
                            </kana-button-submit>
                        </div>
                    </form>
                </kana-form>
            </kana-windowlet>
        `;
    }
}
