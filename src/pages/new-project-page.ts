import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import "../components/forms"
import { MinMaxLength } from "@lion/form-core"
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";

@customElement('new-project-page')
export class NewProjectPage extends LitElement {

    constructor() {
        super();
        loadDefaultFeedbackMessages();
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
                    flex: 1;
                }

                h1 {
                    font-size: 3rem;
                    display: block;
                    width: 100%;
                }

                .project-container {
                    background-color: var(--foreground-color);
                    color: var(--background-color);
                    border-radius: 1rem;
                    padding: 1rem;
                    width: 60%;
                    max-width: 30rem;
                    display: flex;
                    flex-direction: column;
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
                    margin: 5px 0;
                }

                select {
                    padding: 10px;
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
                
            `,
            
        ];
    }

    render() {
        return html`
            <h1>New Project</h1>
            <div class="project-container">
                <h2>New project</h2>
                <h3>Begin your journey</h3>
                <hr />
                <label>Project info</label>
                <kana-form>
                    <form>
                        <div class="form-row">
                            <kana-input
                                label-sr-only="Name"
                                placeholder="Name"
                                name="name"
                                .validators="${[new MinMaxLength({ min: 4, max: 16})]}"
                            ></kana-input>
                            <kana-input
                                label-sr-only="Abbreviation"
                                placeholder="Abbreviation"
                                name="abbreviation"
                                class="small-input"
                                .validators="${[new MinMaxLength({ min: 2, max: 8})]}"
                            ></kana-input>
                        </div>
                        <div class="form-row">
                            <kana-input
                                label-sr-only="Description"
                                placeholder="Description (maximum 64 characters)"
                                name="description"
                                .validators="${[new MinMaxLength({ min: 0, max: 64})]}"
                            ></kana-input>
                        </div>
                        <div class="form-row">
                            <kana-select
                                labe-sr-only="Visibility"
                                name="visibility"
                                placeholder="Visibility"
                            >
                                <select name="visibility-select" slot="input">
                                    <option 
                                        hidden
                                        selected
                                        value>
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
                    </form>
                </kana-form>
            </div>
        `;
    }
}
