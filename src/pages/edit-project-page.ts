import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { KanaCard } from '../components/card';
import '../components/button';
import '../components/card';
import '../components/loader';
import { headerStyles } from '../components/common-styles';
import { KanaloaAPI } from '../api/kanaloa-ethers';
import { AbstractCardsPage } from './abstract-cards-page';
import { KanaForm, formCssCommon, maxLengthPreprocessor } from "../components/forms/forms";
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { MinMaxLength, Required } from "@lion/form-core";

@customElement('edit-project-page')
export class EditProjectPage extends AbstractCardsPage {
    constructor() {
        super();
        loadDefaultFeedbackMessages();
        Required.getMessage = async () => {
            return "Please, enter a value";
        }
    }

    async fetchData() {
        this.isLoading = true;
        
        if (KanaloaAPI.readOnly) {
            this.isLoading = false;
            this.items = [];
        }

        const response: KanaCard[] = [];

        this.isLoading = false;
        this.items = response;
    }

    static get styles() {
        return [
            headerStyles,
            ...formCssCommon,
            css`
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 20px;
                    height: 100%;
                    width: 100%;
                }

                .card-container {
                    display: flex;
                    flex-direction: row;
                    gap: 40px;

                    @media only screen and (max-width: 1600px) {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                .card {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    background-color: var(--foreground-color);
                    color: var(--background-color);
                    border-radius: 1rem;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;
                    width: 100%;

                    @media only screen and (max-width: 1600px) {
                        width: 800px;
                        align-self: center;
                    }

                    @media only screen and (max-width: 1100px) {
                        width: 100%;
                    }
                }

                .line {
                    border: 1px solid var(--primary-color);
                    border-radius: 3px;
                    margin: 0;
                }
            `,
            css`
                kana-form {
                    width: 100%;
                }

                input[type="checkbox"] {
                    zoom: 1.1;
                    transform: scale(1.1);
                    cursor: pointer;
                    outline: 1px solid var(--primary-color);
                    border-radius: 50%;
                    appearance: none;
                    background-color: #ffffff;
                }

                input[type="checkbox"]:checked {
                    zoom: 1.1;
                    transform: scale(1.1);
                    cursor: pointer;
                    border-radius: 50%;
                    appearance: none;
                    background-color: var(--primary-color);
                }

                .form-row-column {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;

                    @media only screen and (max-width: 900px) {
                        flex-direction: column;
                        gap: 10px;

                        > div > kana-button-submit {
                            width: 100%;
                        }
                    }
                }
            `,
            css`
                .left-container {
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                    width: 70%;

                    @media only screen and (max-width: 1100px) {
                        width: 100%;
                    }
                }
            `,
            css`
                .project-container {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    height: 100%;
                }

                .project-title {
                    font-size: 22px;
                }

                .project-info-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .project-info-title {
                    font-weight: bold;
                }

                .role-container {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    height: 100%;

                    @media only screen and (max-width: 900px) {
                        gap: 50px;
                    }
                }

                .search-role-container {
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                }

                .existing-role-container {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;

                    @media only screen and (max-width: 900px) {
                        flex-direction: column;
                    }
                }

                .existing-role-element {
                    padding: 10px;
                    font-size: 14px;
                    box-shadow: 0 0 5px 1px #000000;
                    background-color: var(--primary-color);
                    border-radius: 20px;
                    border: none;
                    color: #ffffff;
                }

                .existing-role-element-selected {
                    background-color: var(--highlighted-color);
                }
            `,
            css`
                .right-container {
                    display: flex;
                    flex-direction: row;
                    gap: 0px;
                    padding: 0px;

                    @media only screen and (max-width: 900px) {
                        flex-direction: column;
                        gap: 30px;
                    }
                }

                .all-agent-container {
                    display: flex;
                    flex-direction: column;
                    width: 70%;

                    @media only screen and (max-width: 900px) {
                        width: 100%;
                    }
                }

                .all-agent-title {
                    color: #9b92cd;
                    padding-top: 30px;
                    padding-left: 30px;
                    margin-bottom: 50px;
                    margin-top: 0px;
                }

                .all-agent-element {
                    display: flex;
                    flex-direction: row;
                    gap: 30px;
                    padding: 10px 0px 10px 30px;
                    cursor: pointer;
                }

                .all-agent-element-image-container {
                    width: 40px;
                    height: 40px;
                    background-color: #000000;
                }

                .all-agent-element-text {
                    align-self: center;
                    font-weight: bold;
                    font-size: 18px;
                }

                .all-agent-element-selected {
                    background-color: #f8f2ff;
                }

                .one-agent-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                    border-radius: 1rem;
                    background-color: #f8f2ff;
                    padding: 30px;

                    @media only screen and (max-width: 900px) {
                        width: auto;
                    }
                }

                .one-agent-image-container {
                    width: 160px;
                    height: 160px;
                    background-color: #000000;
                    align-self: center;
                }

                .one-agent-title-container {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .one-agent-title {
                    text-align: center;
                    font-weight: bold;
                    font-size: 22px;
                }

                .one-agent-wallet {
                    text-align: center;
                }

                .one-agent-role-container {
                    display: flex;
                    flex-direction: column;
                }

                .one-agent-role-title {
                    font-size: 22px;
                    font-weight: bold;
                }

                .one-agent-role-table {
                    text-align: left;
                    width: 100%;
                    border-spacing: 0;
                    border-collapse: collapse;

                    > thead > tr > th {
                        padding-top: 10px;
                        padding-bottom: 10px;
                    }

                    > tbody > tr > td {
                        padding-top: 10px;
                        padding-bottom: 10px;
                        border-top: 2px solid var(--primary-color);
                        border-bottom: 2px solid var(--primary-color);
                    }
                }
            `,
            css`
                .button-container {
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                    justify-content: flex-end;

                    @media only screen and (max-width: 900px) {
                        flex-direction: column;
                    }
                }

                .update-button {
                    width: 350px;

                    @media only screen and (max-width: 900px) {
                        width: 100%;
                    }
                }

                .cancel-button {
                    width: 120px;

                    @media only screen and (max-width: 900px) {
                        width: 100%;
                    }
                }
            `
        ];
    }

    async submitHandler(ev: any) {
        let form: KanaForm = ev.target;

        if (!form.hasFeedbackFor.includes('error')) {
            const formData = ev.target.modelValue;

            console.log(formData);

            //KanaloaAPI.projectRegistry.newProject({
            //    projectName: formData.name,
            //    abbreviation: formData.abbreviation,
            //    description: formData.description,
            //    visibility: 0
            //});
        } else {
            const firstFormElWithError = form.formElements.find((el: any) => el.hasFeedbackFor.includes('error'));

            firstFormElWithError.focus();
        }
    }

    render() {
        return html`
            <div class="container">
                <div class="card-container">
                    <div class="left-container">
                        <div class="card project-container">
                            <h2 class="project-title">*Project Name*</h2>

                            <hr class="line"/>

                            <div class="project-info-container">
                                <div class="project-info-title">Project Info</div>

                                <div class="project-info-form">
                                    <kana-form @submit="${this.submitHandler}">
                                        <form @submit=${(ev: Event) => ev.preventDefault()}>
                                            <div class="form-row-column">
                                                <kana-input
                                                    label-sr-only="*Project Name*"
                                                    placeholder="*Project Name*"
                                                    name="project-name"
                                                    .validators="${[
                                                        new MinMaxLength({ min: 4, max: 16}), // TODO: set correct borders
                                                        new Required()
                                                    ]}"
                                                    .preprocessor=${maxLengthPreprocessor(16)}
                                                ></kana-input>
                                                <kana-input
                                                    label-sr-only="*Project Description*"
                                                    placeholder="*Project Description*"
                                                    name="project-description"
                                                    .validators="${[
                                                        new MinMaxLength({ min: 0, max: 64}), // TODO: set correct borders
                                                    ]}"
                                                    .preprocessor=${maxLengthPreprocessor(64)}
                                                ></kana-input>
                                            </div>
                                            <div class="form-row">
                                                <kana-select
                                                    label-sr-only="Visibility"
                                                    placeholder="Visibility"
                                                    name="add-wallet-visibility"
                                                    .validators=${[ new Required() ]}
                                                >
                                                    <select name="visibility-select" slot="input">
                                                        <option name="public" value="public" selected>Public</option>
                                                        <option name="option1" value="option1">Option 1</option>
                                                        <option name="option2" value="option2">Option 2</option>
                                                        <option name="option3" value="option3">Option 3</option>
                                                    </select>
                                                </kana-select>
                                            </div>
                                            <div class="form-row">
                                                <kana-button-submit>Update Project</kana-button-submit>
                                            </div>
                                        </form>
                                    </kana-form>
                                </div>
                            </div>
                        </div>
                        <div class="card role-container">
                            <div class="search-role-container">
                                <kana-form @submit="${this.submitHandler}">
                                    <form @submit=${(ev: Event) => ev.preventDefault()}>
                                        <div class="form-row-column">
                                            <kana-input
                                                label-sr-only="Search Role"
                                                placeholder="Search Role"
                                                name="search-role"
                                                .validators="${[
                                                    new MinMaxLength({ min: 4, max: 16}), // TODO: set correct borders
                                                    new Required()
                                                ]}"
                                                .preprocessor=${maxLengthPreprocessor(16)}
                                            ></kana-input>

                                            <div>
                                                <kana-button-submit>Add New Role</kana-button-submit>
                                            </div>
                                        </div>
                                    </form>
                                </kana-form>
                            </div>
                            <div class="existing-role-container">
                                <div class="existing-role-element existing-role-element-selected">SuperAdmin</div>
                                <div class="existing-role-element existing-role-element-selected">Admin</div>
                                <div class="existing-role-element">Minter</div>
                                <div class="existing-role-element">Burner</div>
                                <div class="existing-role-element">Pauser</div>
                                <div class="existing-role-element">Plebeian</div>
                            </div>
                        </div>
                    </div>

                    <div class="card right-container">
                        <div class="all-agent-container">
                            <h2 class="all-agent-title">Agents</h2>
                            <div class="all-agent-element all-agent-element-selected">
                                <div class="all-agent-element-image-container"></div>
                                <div class="all-agent-element-text">
                                    SuperAdmin
                                </div>
                            </div>
                            <div class="all-agent-element">
                                <div class="all-agent-element-image-container"></div>
                                <div class="all-agent-element-text">
                                    Admin#1
                                </div>
                            </div>
                            <div class="all-agent-element">
                                <div class="all-agent-element-image-container"></div>
                                <div class="all-agent-element-text">
                                    Admin#2
                                </div>
                            </div>
                        </div>
                        <div class="one-agent-container">
                            <div class="one-agent-image-container"></div>

                            <hr class="line"/>

                            <div class="one-agent-title-container">
                                <div class="one-agent-title">SuperAdmin</div>
                                <div class="one-agent-wallet">0x0328...03d</div>
                            </div>

                            <div class="one-agent-role-container">
                                <h2 class="one-agent-role-title">Roles</h2>

                                <table class="one-agent-role-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>User</th>
                                            <th>Manager</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>SuperAdmin</td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Admin</td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Minter</td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Burner</td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pauser</td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                            <td>
                                                <input type="checkbox"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="button-container">
                    <kana-button class="update-button">Update</kana-button>

                    <a href="projects">
                        <kana-button class="cancel-button">Cancel</kana-button>
                    </a>
                </div>
            </div>
        `;
    }
}
