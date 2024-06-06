import { customElement, property } from "lit/decorators.js";
import { ModuleForm } from "../../commons";
import { css, html } from "lit";
import { KanaForm, maxNumberPreprocessor, Required } from "../../../forms/forms";
import { MinNumber, MaxNumber } from "@lion/form-core";
import { Contract, MaxUint256, ethers } from "ethers";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ERC721Form } from "../../erc721-form";
import { KanaloaAPI } from "../../../../api/kanaloa-ethers";
import { ContractPage } from "src/pages/contract-page";

const enum Status {
    oldEntry = "#00ff51", // green
    changedEntry = "#d1cd00", // yellow
    deletedEntry = "#af0000", // red
    newEntry = "#00d3d5", // blue
}

interface UriDataObject {
	objectId: number;
    isCreated: boolean;
    status: Status;
    tokenId: number|null;
    initialUri: string|null;
    uri: string|null;
}

export const ERC721_OVERRIDE_URI_FORM_TAG = 'erc721_override_uri-test';
@customElement(ERC721_OVERRIDE_URI_FORM_TAG)
export class ERC721OverrideURIForm extends ModuleForm {
    static formAssociated = true;

    @property({ type: Array<UriDataObject> })
    declare uriDataObjectList: Array<UriDataObject>;

    static override get styles() {
        return [
            ...super.styles,
            css`
                kana-button-submit {
                    width: 100%;
                    max-width: 200px;
                }

                .table-container {
                    max-height: 200px;
                    overflow-y: auto;
                }

				table {
					width: 100%;
					border-collapse: collapse;
				}

				table, td {
                    border: 1px solid var(--primary-color);
                }

				th {
					position: sticky;
					top: 0;
					z-index: 1;

					background-color: var(--background-color);
					color: var(--foreground-color);
                    border: 1px solid var(--foreground-color);
					border-bottom: none;
				}

				th:first-child {
					border-left: none;
				}

				th:last-child {
					border-right: none;
				}

				th, td {
					width: 150px;
					padding: 5px;
				}

				td {
					> input {
						width: 100%;
						padding: 3px;
						font-size: 14px;
					}

					> input:disabled {
						opacity: 0.6;
					}
				}

				.wide-column {
					width: 250px;
					text-align: left;
				}

				.middle-column {
					width: 100px;
					text-align: center;
				}

				.small-column {
					width: 50px;
					text-align: center;
				}

				.uri-text {
					padding-left: 3px;
					font-size: 14px;
				}

                .circle {
                    display: inline-block;
                    vertical-align: middle;
                    width: 15px;
                    height: 15px;
                    border-radius: 10px;
                }

                .icon-button {
                    cursor: pointer;
                    font-size: 24px;
					user-select: none;

                    transition: all 300ms ease;
                    transition-property: opacity;

                    &:hover {
                        transition: all 300ms ease;
                        transition-property: opacity;

                        opacity: 0.6;
                    }
                }
            `
        ];
    }

    constructor() {
        super();

        // TODO: get data from blockchain
        this.uriDataObjectList = [
            {
				objectId: 1,
				isCreated: true,
                status: Status.oldEntry,
                tokenId: 1,
				initialUri: "https://hello.com",
                uri: "https://hello.com"
            },
            {
				objectId: 2,
				isCreated: true,
                status: Status.oldEntry,
                tokenId: 2,
				initialUri: "http://super.duper",
                uri: "http://super.duper"
            }
        ];
    }

    static get moduleSignature(): string {
        return "0x5888a10baa117fa10229da1caf1f6221929b8728f7de5dc21a2a08a9df35c3a2"; // TODO-Z: add real signature
    }

    get moduleSignature(): string {
        return ERC721OverrideURIForm.moduleSignature
    }
    
    get initializerABI(): Map<string, string> {
        return new Map();
    }
        
    public erc721Form: ERC721Form | null = null; 
    setParent(ref: ModuleForm): void {
        this.erc721Form = ref as ERC721Form;
    }

    load(): Record<string, any> {
        return [];
    }

    protected isValid(): boolean {
        const form = this.kanaForm;

        if (form == null) {
            return false;
        }

        form.formElements.forEach(
            // Whomst, in their right mind, caches validation results? 
            (el) => el.validate({ clearCurrentResult: true })
        );
        form.validate({ clearCurrentResult: true });
        if ((form as KanaForm).hasFeedbackFor.includes('error')) {
            const firstFormElWithError = (form as KanaForm).formElements.find(
                    (el: any) => el.hasFeedbackFor.includes('error'),
            );
            firstFormElWithError.focus();
            return false;
        }

        return true;
    }

    async compileModuleParameters(root: any): Promise<ModuleParameters | null> {
        const form = this.kanaForm;

        if (form == null) {
            return null;
        }

        if (this.isValid() == false) {
            return null;
        }

        const model: any = form.modelValue;
        return {
            moduleSignature: this.moduleSignature,
            initParams: ethers.AbiCoder.defaultAbiCoder().encode(
                Array.from(this.initializerABI.values()),
                []
            )
        };
    }

    async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.isValid() == false) {
            return;
        }

        // TODO: blockchain interaction with this.data
		// TODO: get all updates from the blockchain and set this.data like in the constructor
    }

	// ---- URI - GETTER ----

	getNonGreenUriObjects() {
		return this.uriDataObjectList.filter(uriObject => uriObject.status !== Status.oldEntry);
	}

	getFormattedUri(uri: string|null) {
		if (uri !== null) {
			let maxLength = 30;

			return uri.length > maxLength ? uri.slice(0, maxLength - 3) + "..." : uri;
		}
	}

	getStatusString(status: Status) {
		switch (status) {
			case Status.oldEntry:
				return "This is an existing entry.";
			case Status.changedEntry:
				return "This entry will be changed on \"Update\".";
			case Status.deletedEntry:
				return "This entry will be deleted on \"Update\"";
			case Status.newEntry:
				return "This entry will be added on \"Update\"";
		}
	}

	// ---- URI - INTERACTIONS ----

    addNewUriObject() {
		const objectIds = this.uriDataObjectList.map(uriObject => uriObject.objectId)
		const maxObjectId = Math.max(...objectIds);

		const newObject = {
			objectId: maxObjectId + 1,
			isCreated: false,
			status: Status.newEntry,
			tokenId: null,
			initialUri: null,
			uri: null
		}

        this.uriDataObjectList = [...this.uriDataObjectList, newObject];
    }

	updateTokenId(objectId: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const newValue = parseInt(input.value);

		const allIds = this.uriDataObjectList.map(uriObject => uriObject.tokenId);

		if (!allIds.includes(newValue)) {
			this.uriDataObjectList = this.uriDataObjectList.map(uriObject => {
				if (uriObject.objectId === objectId) {
					uriObject.tokenId = newValue;
				}
	
				return uriObject;
			});
		} else {
			input.value = "";
			alert("This ID already exists in the table.");
		}
	}

	updateUri(objectId: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const newValue = input.value;

		this.uriDataObjectList = this.uriDataObjectList.map(uriObject => {
			if (uriObject.objectId === objectId) {
				uriObject.uri = newValue;

				if (newValue === uriObject.initialUri) {
					uriObject.status = Status.oldEntry;
				} else {
					uriObject.status = Status.changedEntry;
				}
			}

			return uriObject;
		});
	}

    removeUriObject(objectId: number) {
		this.uriDataObjectList = this.uriDataObjectList
			.map(uriObject => {
				if (uriObject.objectId === objectId) {
					switch (uriObject.status) {
						case Status.oldEntry:
							return { ...uriObject, status: Status.deletedEntry };
						case Status.changedEntry:
							if (uriObject.isCreated) {

								return { ...uriObject, uri: uriObject.initialUri, status: Status.oldEntry };
							} else {
								return undefined;
							}
						case Status.deletedEntry:
							return { ...uriObject, uri: uriObject.initialUri, status: Status.oldEntry };
						case Status.newEntry:
							return undefined;
					}
				} else {
					return uriObject;
				}
			})
			.filter((uriObject): uriObject is UriDataObject => uriObject !== undefined);
    }

    render() {
        const isInstalled = true; // TODO-Z: remove this line

		// TODO-Z: uncomment the following lines
        /* const isInstalled = 
            ((this.getRootNode() as ShadowRoot).host as ContractPage)
                .modulesList
                .value?.onchainModules[this.moduleSignature] != null; */
                
        return html`
            <hr>
            <h3>Override URI for ERC721</h3>
            <kana-form @submit="${(ev: Event) => ev.preventDefault()}">
                <form @submit=${(ev: Event) => ev.preventDefault()}>
                    <div class="form-row">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="small-column"><span>Status</span></th>
                                        <th class="middle-column">Token ID</th>
                                        <th class="wide-column">Override URI</th>
                                        <th class="small-column"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${
                                        this.uriDataObjectList.length > 0
                                        ?
                                            this.uriDataObjectList.map(uriObject => html`
                                                <tr>
                                                    <td class="small-column">
                                                        <span class="circle" style="background-color: ${uriObject.status}" title="${this.getStatusString(uriObject.status)}"></span>
                                                    </td>
                                                    <td class="middle-column">
														${
															(uriObject.status === Status.newEntry || uriObject.status === Status.changedEntry) && uriObject.tokenId === null
															?
																html`<input type="number" @change=${(event: Event) => this.updateTokenId(uriObject.objectId, event)} .value=${uriObject.tokenId ?? ""}/>`
															:
																html`<span>${uriObject.tokenId}</span>`
														}
													</td>
                                                    <td class="wide-column">
														${
															uriObject.status !== Status.deletedEntry
															?
																html`<input type="text" @input=${(event: Event) => this.updateUri(uriObject.objectId, event)} .value=${uriObject.uri ?? ""} ?disabled="${uriObject.tokenId === null}"/>`
															:
																html`<span class="uri-text">${this.getFormattedUri(uriObject.uri)}</span>`
														}
													</td>
                                                    <td class="small-column">
														<span class="icon-button" @click=${() => this.removeUriObject(uriObject.objectId)}>
															${
																((uriObject.initialUri !== uriObject.uri && uriObject.isCreated) || uriObject.status === Status.deletedEntry)
																?
																	html`&#9865;`
																:
																	html`&#10006;`
															}
														</span>
                                                    </td>
                                                </tr>
                                            `)
                                        :
											html`<span>no data available</span>`
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-row">
                        <kana-button-submit @click=${this.actionHandler} ?disabled=${!isInstalled}>
                            Update
                        </kana-button-submit>

                        <kana-button @click=${() => this.addNewUriObject()}>
                            Add Row
                        </kana-button>
                    </div>
                </form>
            </kana-form>
            ${
                (!isInstalled) ? 
                    html`
                        <div>
                            <small>
                                This module will be installed. 
                                Related functionality will be enabled
                                after the installation is completed.
                            </small>
                        </div>
                    ` : 
                    ""
            }
        `;
    }
}