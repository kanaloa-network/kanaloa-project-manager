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

interface DataObject {
    status: Status;
    tokenId: number;
    uri: string;
}

export const ERC721_OVERRIDE_URI_FORM_TAG = 'erc721_override_uri-test';
@customElement(ERC721_OVERRIDE_URI_FORM_TAG)
export class ERC721OverrideURIForm extends ModuleForm {
    static formAssociated = true;

    @property({ type: Array<DataObject> })
    declare data: Array<DataObject>;

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
                
                table, th, td {
                    border: 1px solid var(--primary-color);
                    border-collapse: collapse;
                }

                tr {
                    > th, > td {
                        width: 150px;
                        text-align: center;
                        padding: 10px;
                    }

                    > th:first-child, > td:first-child, > th:last-child, > td:last-child {
                        width: 50px;
                    }
                }

                .circle {
                    display: inline-block;
                    vertical-align: middle;
                    width: 15px;
                    height: 15px;
                    border-radius: 10px;
                }

                .delete-button {
                    cursor: pointer;
                    font-size: 24px;

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
        this.data = [
            {
                status: Status.oldEntry,
                tokenId: 1,
                uri: "entry1"
            },
            {
                status: Status.oldEntry,
                tokenId: 2,
                uri: "entry2"
            },
            {
                status: Status.oldEntry,
                tokenId: 3,
                uri: "entry3"
            },
            {
                status: Status.oldEntry,
                tokenId: 4,
                uri: "entry4"
            },
            {
                status: Status.oldEntry,
                tokenId: 5,
                uri: "entry5"
            },
        ];
    }

    static get moduleSignature(): string {
        return "0x5888a10baa117fa10229da1caf1f6221929b8728f7de5dc21a2a08a9df35c3a2"; // TODO: add real signature
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

        // TODO: blockchain interaction
    }

    async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.isValid() == false) {
            return;
        }
    }

    addElement(data: DataObject) {
        this.data = [...this.data, data];
    }

    removeElement(tokenId: number) {
        this.data = this.data.filter(element => element.tokenId !== tokenId);
    }

    render() {
        const isInstalled = true;

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
                                        <th>Status</th>
                                        <th>Token ID</th>
                                        <th>Override URI</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${
                                        this.data.length > 0
                                        ?
                                            this.data.map(element => html`
                                                <tr>
                                                    <td>
                                                        <span class="circle" style="background-color: ${element.status}"></span>
                                                    </td>
                                                    <td>${element.tokenId}</td>
                                                    <td>${element.uri}</td>
                                                    <td>
                                                        <span class="delete-button" @click=${() => this.removeElement(element.tokenId)}>&#10006;</span>
                                                    </td>
                                                </tr>
                                            `)
                                        :
                                            `Nothing`
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-row">
                        <kana-button-submit @click=${this.actionHandler} ?disabled=${!isInstalled}>
                            Update
                        </kana-button-submit>

                        <kana-button @click=${() => this.addElement({
                            status: Status.newEntry,
                            tokenId: Math.floor(Math.random() * 1000),
                            uri: "new entry"
                        })}>
                            Add Element
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