import { customElement, property } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { html } from "lit";
import { KanaForm, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber, Pattern } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import "../forms/pulpito/pulpito-input";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { KanaloaAPI } from "../../api/kanaloa-ethers";

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

    render() {
        return html`
            <h2>ERC721 module</h2>
            <hr>
            <h3>The non-fungible token (NFT) standard</h3>
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
        `;
    }
    
}