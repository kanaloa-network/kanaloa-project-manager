import { customElement, property } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { css, html } from "lit";
import { KanaForm, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber, Pattern } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import "../forms/pulpito/pulpito-input";
import { ModuleParameters } from "src/api/kanaloa-project-registry";

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

export const ERC721_FORM_TAG = 'erc721-form';
@customElement(ERC721_FORM_TAG)
export class ERC721Form extends ModuleForm {
    static formAssociated = true;

    @property({ type: String })
    declare baseURI: string;

    @property({ type: String })
    declare suffixURI: string;

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

				.uri-container {
					margin-top: 20px;
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

				td > input {
					width: 100%;
					padding: 3px;
					font-size: 14px;

					&:disabled {
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
        return "0xc991fd72eab8271a09eb3e6db40963b2d53ec5a906b9363b5696eba097f72a5e";
    }
    
    static get initializerABI(): Map<string, string> {
        return new Map([
            ["name", "string"],
            ["symbol", "string"], 
            ["baseTokenURI", "string"],
            ["maxSupply", "uint256"]
        ]);
    }

    get moduleSignature(): string {
        return ERC721Form.moduleSignature;
    }

    get initializerABI(): Map<string, string> {
        return ERC721Form.initializerABI;
    }

    load(rawData: ethers.BytesLike) {
        const data = super.load(rawData);
        
        // Look, not my proudest hack, but it gets the job done
        (this.getRootNode() as any).host
            .newContractBaseWindowlet
            .value!.formBase
            .value!.querySelector("#root-name-input")
            .modelValue = data.name;

        this.baseURI = data.baseTokenURI;

        return data;
    }

    formatHook(d: Record<string, any>): Record<string, any> {
        d["maxSupply"] = Number(d["maxSupply"] / (10n ** 18n));
        return d;
    }

    async compileModuleParameters(
        root: any
    ): Promise<ModuleParameters | null> {
        const form = this.kanaForm;

        if (form == null) {
            return null;
        }

        form.validate();
        if ((form as KanaForm).hasFeedbackFor.includes('error')) {
            const firstFormElWithError = (form as KanaForm).formElements.find(
                    (el: any) => el.hasFeedbackFor.includes('error'),
            );
            firstFormElWithError.focus();
            return null;
        }

        const model: any = form.modelValue;
        return {
            moduleSignature: ERC721Form.moduleSignature,
            initParams: ethers.AbiCoder.defaultAbiCoder().encode(
                Array.from(ERC721Form.initializerABI.values()),
                [ 
                    root.name,
                    model.symbol,
                    model.baseTokenURI,
                    BigInt(model.maxSupply) * 10n ** 18n
                ]
            )
        };
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

	async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        // TODO: blockchain interaction with this.data
		// TODO: get all updates from the blockchain and set this.data like in the constructor
    }

    render() {
        return html`
            <h2>ERC721 module</h2>
            <hr>
            <h3>The non-fungible token (NFT) standard</h3>
			<div>
				<kana-form>
					<form class="form-new">
						<div class="form-element-new">
							<label>Symbol</label>
							<kana-input
								label-sr-only="Symbol"
								placeholder="ie. USDC, BTC..."
								name="symbol"
								.validators="${[
									new MinMaxLength({ min: 2, max: 8}),
									new Required()
								]}"
								.preprocessor=${maxLengthPreprocessor(8)}
							></kana-input>
						</div>
						<div class="form-column-new">
							<div class="form-row-new">
								<div class="form-element-new">
									<kana-tooltip has-arrow>
										<label slot="invoker">Base Token URI &#8505;</label>
										<div slot="content">The base URI to reach your NFTs.</div>
									</kana-tooltip>
									<kana-input
										label-sr-only="Base Token URI"
										placeholder="ie. https://nfts.yoururl.com"
										name="baseTokenURI"
										.validators="${[
											new MinMaxLength({ min: 2, max: 50}),
											new Pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi),
											new Required()
										]}"
										.preprocessor=${maxLengthPreprocessor(50)}
										.value="${this.baseURI}"
										@input="${(event: InputEvent) => this.baseURI = (event.target as HTMLInputElement).value}"
									></kana-input>
								</div>
								<div class="form-element-new">
									<kana-tooltip has-arrow>
										<label slot="invoker">Suffix Token URI &#8505;</label>
										<div slot="content">The suffix for NFTs meaning the filetype.</div>
									</kana-tooltip>
									<kana-input
										label-sr-only="Suffix Token URI"
										placeholder="ie. .png, .jpeg, ..."
										name="suffixTokenURI"
										.validators="${[
											new MinMaxLength({ min: 4, max: 5}),
											new Pattern(/^\./),
											new Required()
										]}"
										.preprocessor=${maxLengthPreprocessor(5)}
										.value="${this.suffixURI}"
										@input="${(event: InputEvent) => this.suffixURI = (event.target as HTMLInputElement).value}"
									></kana-input>
								</div>
							</div>
							<span>
								Full URI: <b>${(this.baseURI !== undefined && this.baseURI !== "") ? this.baseURI : "https://nfts.yoururl.com"}/YOUR_NFT${(this.suffixURI !== undefined && this.suffixURI !== "") ? this.suffixURI : ".png"}</b>
							</span>
						</div>
						<div class="form-element-new">
							<label>Supply</label>
							<kana-input-amount
								label-sr-only="Supply"
								placeholder="10000"
								name="maxSupply"
								.validators="${[
									new MinNumber(1),
									new MaxNumber(MaxUint256),
									new Required()
								]}"
								.preprocessor=${maxNumberPreprocessor(MaxUint256)}
								.modelValue=${10000}
							></kana-input-amount>
						</div>
					</form>
				</kana-form>
			</div>
			${
				!window.location.href.includes("new-contract")
				?
					html`
						<div class="uri-container">
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
										<kana-button-submit @click=${this.actionHandler}>
											Update
										</kana-button-submit>

										<kana-button @click=${() => this.addNewUriObject()}>
											Add Row
										</kana-button>
									</div>
								</form>
							</kana-form>
						</div>
					`
				:
					``
			}
        `;
    }
    
}