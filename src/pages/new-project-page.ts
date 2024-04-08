import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
import { customElement } from 'lit/decorators.js';
import "../components/windowlet"
import { MinMaxLength, Required } from "@lion/form-core"
import { loadDefaultFeedbackMessages } from "@lion/validate-messages";
import { KanaForm, formCssCommon, maxLengthPreprocessor } from "../components/forms/forms";
import { KanaloaAPI } from '../api/kanaloa-ethers';
import { TaxableOperations } from '../api/payments-processor';
import { LoadingIcon } from '../components/loader';
import { Router } from '@vaadin/router';


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
			...formCssCommon,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 1rem;
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
					opacity: 0.8;
                    font-size: 1.5rem;
                    margin: 0;
                }

                hr {
                    border: none;
                    height: 2px;
                    background-color: var(--background-light-color);
                    margin: 1.5rem 0 1.5rem;
                }

                kana-windowlet {
                    display: flex;
					flex-direction: column;
					width: fit-content;
					min-width: 500px;

					@media only screen and (max-width: 900px) {
						min-width: auto;
						width: 100%;
					}
                }
            `
        ];
    }

    async submitHandler(ev: any) {
        let form: KanaForm = ev.target;
		let buttonText = (form.querySelector("kana-button-submit")!.children[0] as HTMLElement).innerText;

		if (buttonText === "Switch your Chain") {
			KanaloaAPI.switchChain().then(() => {
				window.location.reload();
			});

			return;
		}

        if (form.hasFeedbackFor.includes('error')) {
          const firstFormElWithError = form.formElements.find(
                (el: any) => el.hasFeedbackFor.includes('error'),
          );
          firstFormElWithError.focus();
          return;
        }
        const formData = ev.target.modelValue;
        
        const projectCost = 
            await KanaloaAPI.paymentsProcessor.calculateInvoice(
                TaxableOperations.NEW_PROJECT,
                { 
                    client: await (await (await KanaloaAPI.signer)!).getAddress(),
                    token: KanaloaAPI.KANA_TOKEN
                }
            );

        if (await KanaloaAPI.paymentsProcessor.requestAllowance(projectCost!) == false) {
            return;
        }


        await KanaloaAPI.projectRegistry.newProject({
            projectName: formData.name,
            abbreviation: formData.abbreviation,
            description: formData.description
        })
        .then(
            () => Router.go(`/projects/`)
        )
        .catch(console.error)

      };

      private calculatedCost = new Task(this, {
        task: async ([token]) => {
            const client = await (await KanaloaAPI.signer)!.getAddress();
            const projectCost = 
                await KanaloaAPI.paymentsProcessor.calculateInvoice(
                    TaxableOperations.NEW_PROJECT,
                    { 
                        client: client,
                        token: token
                    }
                );
                return projectCost!;
            },
            args: () => [KanaloaAPI.KANA_TOKEN]
        }
    );

    render() {
        const cost = this.calculatedCost.render({
            pending: () => {
				return html`<span><loading-icon size="1em"><loading-icon></span>`
			},
            complete: (value) => {
				const formattedValue = value / 10n ** 18n;

				return html`<span>Deploy New Project (${formattedValue} $KANA)</span>`;
			},
            error: (error) => {
				console.log(error);

				let errorMessage = "Error";

				if ((error as Error).message.includes("could not decode result data")) {
					errorMessage = "Switch your Chain";
				}

				return html`<span>${errorMessage}</span>`;
			},
        });

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
                            <kana-button-submit>
								${cost}
                            </kana-button-submit>
                        </div>
                    </form>
                </kana-form>
            </kana-windowlet>
        `;
    }
}
