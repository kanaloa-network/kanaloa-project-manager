import { customElement, property, state } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { css, html } from "lit";
import { KanaForm, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber, Pattern } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import "../forms/pulpito/pulpito-input";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { LitElement } from "lit";
import { ContractPage } from "src/pages/contract-page";

export const ERC721_FORM_TAG = 'erc721-form';
@customElement(ERC721_FORM_TAG)
export class ERC721Form extends ModuleForm {
    static formAssociated = true;

    @property({ type: String })
    declare baseURI: string;

    @property({ type: String })
    declare suffixURI: string;

    constructor() {
        super();

        // TODO: get data from blockchain
        // this.uriDataObjectList = [
        //     {
        //         objectId: 1,
        //         isCreated: true,
        //         status: Status.oldEntry,
        //         tokenId: 1,
        //         initialUri: "https://hello.com",
        //         uri: "https://hello.com"
        //     },
        //     {
        //         objectId: 2,
        //         isCreated: true,
        //         status: Status.oldEntry,
        //         tokenId: 2,
        //         initialUri: "http://super.duper",
        //         uri: "http://super.duper"
        //     }
        // ];
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
                    BigInt(model.maxSupply)
                ]
            )
        };
    }

    formatHook(d: Record<string, any>): Record<string, any> {
        d["maxSupply"] = Number(d["maxSupply"]);
        return d;
    }

    render() {
        const address = 
            ((this.getRootNode() as ShadowRoot).host as ContractPage).contract;
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
                                        <label slot="invoker">
                                            Base token URI &#8505;
                                        </label>
                                        <div slot="content">
                                            The base URL to reach your NFT.
                                        </div>
                                    </kana-tooltip>
                                    <kana-input
                                        label-sr-only="Base Token URI"
                                        placeholder="ie. https://nfts.yoururl.com"
                                        name="baseTokenURI"
                                        .validators="${[
                                            new MinMaxLength({ min: 2, max: 50}),
                                            // URL are weird. The user may have different needs
                                            /*new Pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi),*/
                                            new Required()
                                        ]}"
                                        .preprocessor=${maxLengthPreprocessor(50)} 
                                        .value="${this.baseURI}"
                                        @input="${
                                            (event: InputEvent) => 
                                                this.baseURI = (event.target as HTMLInputElement).value
                                        }"
                                    ></kana-input>
                                </div>
                                <div class="form-element-new">
                                    <kana-tooltip has-arrow>
                                        <label slot="invoker">
                                            Token URI suffix &#8505;</label>
                                        <div slot="content">
                                            The suffix for the NFT's URL (i.e. the file format extension).
                                        </div>
                                    </kana-tooltip>
                                    <kana-input
                                        label-sr-only="Token URI suffix"
                                        placeholder="ie. .png, .jpeg, ..."
                                        name="suffixTokenURI""
                                        .preprocessor=${maxLengthPreprocessor(8)}
                                        .value="${this.suffixURI}"
                                        @input="${
                                            (event: InputEvent) => 
                                                this.suffixURI = (event.target as HTMLInputElement).value
                                        }"
                                    ></kana-input>
                                </div>
                            </div>
                            ${
                                (this.baseURI != null && this.baseURI != "") 
                                    ? html`
                                        <span>
                                            Sample URI: <b>${
                                                `${this.baseURI}0${this.suffixURI != null ? this.suffixURI : ""}
                                            `}</b>
                                        </span>
                                    `
                                    : ""
                            }
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
                address != null
                    ? html`
                        <erc721-override-uri 
                            contract="${address}">
                        </erc721-override-uri>`
                    : ``
            }
        `;
    }
    
}

enum Status {
    oldEntry = "#00ff51", // green
    changedEntry = "#d1cd00", // yellow
    deletedEntry = "#af0000", // red
    newEntry = "#00d3d5", // blue
}

interface UriDataObject {
    objectId: number;
    isCreated: boolean;
    status: Status;
    tokenId?: number;
    initialUri?: string;
    uri?: string;
}

@customElement("erc721-override-uri")
export class ERC721OverrideUriComponent extends LitElement {

    @property({ type: String })
    declare contract: string;
    
    @state()
    declare uriDataObjectList: UriDataObject[];

    constructor () {
        super();
        this.uriDataObjectList = [];
    }

    static get styles() {
        return [
            css`
                kana-button-submit {
                    width: 100%;
                    max-width: 200px;
                }

                :host {
                    margin-top: 20px;
                    display: block;
                }

                .table-container {
                    max-height: 200px;
                    overflow-y: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
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
                    box-sizing: border-box;
                }

                td > input {
                    width: 100%;
                    padding: 3px;
                    font-size: 14px;
                    box-sizing: border-box;

                    &:disabled {
                        opacity: 0.6;
                    }
                }

                .wide-column {
                    width: 270px;
                    text-align: left;
                }

                .middle-column {
                    width: 120px;
                    text-align: center;
                }

                .small-column {
                    width: 70px;
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

    // ---- URI - GETTER ----

    getModifiedUriObjects() {
        return this.uriDataObjectList.filter(
            uriObject => uriObject.status !== Status.oldEntry
        );
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
        const maxObjectId = 
            this.uriDataObjectList
                .map(uriObject => uriObject.objectId)
                .reduce((prev, curr) => Math.max(prev, curr), -1);
                
        const newObject: UriDataObject = {
            objectId: maxObjectId + 1,
            isCreated: false,
            status: Status.newEntry
        }

        this.uriDataObjectList.push(newObject);
        this.requestUpdate();
    }

    updateTokenId(objectId: number, event: Event) {
        const input = event.target as HTMLInputElement;
        const newValue = parseInt(input.value);

        const contains = 
            this.uriDataObjectList
                .some(uriObject => uriObject.tokenId === newValue);

        if (!contains) {
            const entry = 
                this.uriDataObjectList
                    .find(uriObject => uriObject.objectId === objectId)!;
            
            entry.tokenId = newValue;
            this.requestUpdate();
        } else {
            input.value = "";
            alert("This ID already exists in the table.");
        }
    }

    updateUri(objectId: number, event: Event) {
        const input = event.target as HTMLInputElement;
        const newValue = input.value;

        const target = 
            this.uriDataObjectList
                .find(uriObject => uriObject.objectId === objectId)!;

        target.uri = newValue;
        if (target.status !== Status.newEntry) {
            if (newValue === target.initialUri) {
                target.status = Status.oldEntry;
            } else {
                target.status = Status.changedEntry;
            }
        }
    }

    removeUriObject(objectId: number) {
        const target =
            this.uriDataObjectList
                .find(entry => entry.objectId === objectId)!;
        
 
        if ((target.status == Status.changedEntry && !target.isCreated)
            || target.status == Status.newEntry) {
            this.uriDataObjectList =
                this.uriDataObjectList.filter(entry => entry != target);
            return;
        }

        if (target.status == Status.oldEntry) {
            target.status = Status.deletedEntry;
        } else if (
            target.status == Status.changedEntry 
            || target.status == Status.deletedEntry
        ) {
            target.uri= target.initialUri
            target.status = Status.oldEntry 
        }

        this.requestUpdate();
    }

    async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        // TODO: blockchain interaction with this.data
        // TODO: get all updates from the blockchain and set this.data like in the constructor
    }

    render() {
        const entries = this.uriDataObjectList.map(entry => html`
            <tr>
                <td class="small-column">
                    <span 
                        class="circle" 
                        style="background-color: ${entry.status}" 
                        title="${this.getStatusString(entry.status)}"
                    >
                    </span>
                </td>
                <td class="middle-column">
                    ${
                        entry.status == Status.newEntry
                            ? html`
                                <input 
                                    type="number" 
                                    @change=${
                                        (ev: Event) => 
                                            this.updateTokenId(entry.objectId, ev)
                                    } 
                                    .value=${entry.tokenId ?? ""}
                                />`
                            : html`<span>${entry.tokenId}</span>`
                    }
                </td>
                <td class="wide-column">${
                    html`
                        <input 
                            type="text" 
                            @input=${
                                (ev: Event) => this.updateUri(entry.objectId, ev)
                            } 
                            .value=${entry.uri ?? ""} 
                            ?disabled="${
                                entry.tokenId == null 
                                || entry.status == Status.deletedEntry
                            }"
                        />`
                }</td>
                <td class="small-column">
                    <span 
                        class="icon-button" 
                        @click=${() => this.removeUriObject(entry.objectId)}
                    >${
                        (
                            (entry.initialUri != entry.uri && entry.isCreated) 
                            || entry.status === Status.deletedEntry
                        ) ? html`&#9865;` : html`&#10006;`
                    }</span>
                </td>
            </tr>
        `)

        return html`
            <kana-form @submit="${(ev: Event) => ev.preventDefault()}">
                <form @submit=${(ev: Event) => ev.preventDefault()}>
                    <div class="form-row">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="small-column">
                                            <span>Status</span>
                                        </th>
                                        <th class="middle-column">
                                            Token ID
                                        </th>
                                        <th class="wide-column">
                                            Override URI
                                        </th>
                                        <th class="small-column"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${
                                        entries.length > 0
                                            ? entries 
                                            : html`
                                                <td colspan="4">
                                                    No overrides registered for
                                                    this contract
                                                </td>`
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
                            Add row
                        </kana-button>
                    </div>
                </form>
            </kana-form>
        `;
    }

}