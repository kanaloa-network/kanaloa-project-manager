import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { KanaCard } from '../components/card';
import '../components/button';
import '../components/card';
import '../components/loader';
import { headerStyles } from '../components/common-styles';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { AbstractCardsPage } from './abstract-cards-page';
import { KanaForm, maxLengthPreprocessor } from "../components/forms/forms";
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
        
        if (GlobalKanaloaEthers.readOnly) {
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

					@media only screen and (max-width: 1100px) {
						flex-direction: column;
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
				}

				.line {
					border: 1px solid var(--primary-color);
					border-radius: 3px;
					margin: 0;
				}






				.left-container {
					display: flex;
					flex-direction: column;
					gap: 30px;
				}

				.project-container {
					display: flex;
					flex-direction: column;
					gap: 30px;
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
					gap: 100px;
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








				.right-container {
					display: flex;
					flex-direction: row;
				}

				.all-agent-container {
					display: flex;
					flex-direction: column;
				}

				.all-agent-element {

				}

				.selected-all-agent-element {

				}

				.one-agent-container {
					display: flex;
					flex-direction: column;
					gap: 20px;
				}







				kana-form {
					width: 100%;
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
                    border-radius: 10px;
                    background-color: var(--primary-color);
                    color: var(--foreground-color);
                    box-sizing: border-box;
					font-size: 18px;
                }

				input::placeholder {
					color: var(--foreground-color);
				}
                
                input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--highlighted-light-color);
                }

                .form-row {
                    display: flex;
                    gap: 1rem;
                    margin: 10px 0;
                    flex-flow: row wrap;
                }

				.form-row-column {
					display: flex;
					flex-direction: row;
					gap: 10px;
				}

                select {
                    padding: 10px;
                    padding-right: 2rem;
                    border: none;
                    border-radius: 10px;
                    background-color: var(--primary-color);
                    color: var(--foreground-color);
                    font-size: 1rem;
                    appearance: none;
                    cursor: pointer;
                    flex: 1;
					font-size: 18px;
                }
                
                select:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--highlighted-light-color);
                }
                
                kana-button-submit {
					border-radius: 10px;
                    min-width: fit-content;
                    flex: 1;
                }







				.button-container {
					display: flex;
					flex-direction: row;
					gap: 20px;
					justify-content: flex-end;

					@media only screen and (max-width: 700px) {
						flex-direction: column;
					}
				}

				.update-button {
					width: 350px;

					@media only screen and (max-width: 700px) {
						width: 100%;
					}
				}

				.cancel-button {
					width: 120px;

					@media only screen and (max-width: 700px) {
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

			//GlobalKanaloaEthers.projectRegistry.newProject({
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
							<div class="selected-all-agent-element">
								
							</div>
							<div class="all-agent-element">
								
							</div>
							<div class="all-agent-element">
								
							</div>
						</div>
						<div class="one-agent-container">
							
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
