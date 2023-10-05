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
import { MinMaxLength, Required } from "@lion/form-core";


@customElement('profile-page')
export class ProfilePage extends AbstractCardsPage {
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

				.card-title {
					font-size: 18px;
				}

				.profile-card {

				}

				.profile-card-sub-container {
					display: flex;
					flex-direction: column;
					gap: 20px;
				}

				.profile-image-container {
					width: 200px;
					height: 200px;
					align-self: center;
				}

				.profile-image-1 {
					fill: var(--primary-color);
				}

				.profile-wallet-address {
					color: #000000;
					font-weight: bold;
				}

				.profile-line {
					border: 1px solid var(--primary-color);
					border-radius: 3px;
					margin: 0;
				}

				.profile-form-inputs {
					
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

				.profile-wallet-container {
					min-height: 70px;
				}

				.profile-project-container {
					display: flex;
					flex-direction: row;
					gap: 20px;

					> a {
						width: 100%;

						> kana-button {
							width: 100%;
						}
					}

					@media only screen and (max-width: 700px) {
						flex-direction: column;
					}
				}

				.overview-card {
					max-width: 300px;
					min-height: 400px;

					@media only screen and (max-width: 1100px) {
						max-width: none;
					}
				}

				.project-card {
					
				}

				.project-container {

				}

				.role-card {
					
				}

				.role-container {

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
					<div class="card profile-card">
						<div class="profile-card-sub-container">
							<div class="profile-image-container">
								<svg class="profile-image-1" viewBox="0 0 24 24">
									<path d="M0 0h24v24H0z" fill="none"></path>
									<path d="M18.39 14.56C16.71 13.7 14.53 13 12 13s-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 17.22V20h16v-2.78c0-1.12-.61-2.15-1.61-2.66zM9.78 12h4.44c1.21 0 2.14-1.06 1.98-2.26l-.32-2.45C15.57 5.39 13.92 4 12 4S8.43 5.39 8.12 7.29L7.8 9.74c-.16 1.2.77 2.26 1.98 2.26z"></path>
								</svg>
							</div>
							<div class="profile-wallet-address">
								<span>Wallet Adress:</span>
								<span></span>
							</div>
						</div>

						<hr class="profile-line"/>

						<div class="profile-form-inputs">
							<kana-form @submit="${this.submitHandler}">
								<form @submit=${(ev: Event) => ev.preventDefault()}>
									<div class="form-row">
										<kana-input
											label-sr-only="Display Name"
											placeholder="Display Name"
											name="add-wallet-display-name"
											.validators="${[
												new MinMaxLength({ min: 4, max: 16}), // TODO: set correct borders
												new Required()
											]}"
											.preprocessor=${maxLengthPreprocessor(16)}
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
										<kana-input
											label-sr-only="Chain"
											placeholder="Chain"
											name="add-wallet-chain"
											.validators="${[
												new MinMaxLength({ min: 0, max: 64}),
											]}"
											.preprocessor=${maxLengthPreprocessor(64)}
										></kana-input>
									</div>
									<div class="form-row">
										<kana-button-submit>Add Wallet</kana-button-submit>
									</div>
								</form>
							</kana-form>
						</div>
						<div class="profile-wallet-container">
							<span>My Wallets</span>
						</div>
						<div class="profile-project-container">
							<a href="projects">
								<kana-button>My Projects</kana-button>
							</a>
							<a href="new-project">
								<kana-button>New</kana-button>
							</a>
						</div>
					</div>
					<div class="card project-card overview-card">
						<h2 class="card-title">Overview Projects</h2>

						<div class="project-container">
							
						</div>
					</div>
					<div class="card role-card overview-card">
						<h2 class="card-title">Overview Roles</h2>

						<div class="role-container">
							
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
