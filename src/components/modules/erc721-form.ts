import { customElement } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { html } from "lit";
import { KanaForm, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import "../forms/pulpito/pulpito-input";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { KanaloaAPI } from "../../api/kanaloa-ethers";

export const ERC721_FORM_TAG = 'erc721-form';
@customElement(ERC721_FORM_TAG)
export class ERC721Form extends ModuleForm {
    static formAssociated = true;

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
            .modelValue = data._name;

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

        const model: any = form.modelValue; console.log(model);
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

    asUpstream(local: ethers.BytesLike): boolean {
        // Due to how ERC721 is initialized, it requires an address parameter
        // that is not returned with peekState. We will truncate the last 32
        // bytes before comparing
        
        // A bit of an explanation on the slicing: 258 is the position at which
        // the address begins ("0x" + 256 chars). It continues for 64 bytes,
        // and then it's all the same. The loadedRawData always returns the
        // zeroth address.
        const relocal = 
            local.slice(0, 258) + ethers.ZeroHash.slice(2) + local.slice(322);
        return relocal == this.loadedRawData;
    }

    render() {
        return html`
            <h2>ERC721 module</h2>
            <hr>
            <h3>The non-fungible token (NFT) standard</h3>
            <kana-form>
                <form>
                    <div class="form-row">
                        <span>
                            <label>Symbol</label>
                            <br/>
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
                        </span>
                    </div>
					<div class="form-row">
                        <span>
                            <label>Base Token URI &#8505;</label>
                            <br/>
                            <kana-input
                                label-sr-only="Base Token URI"
                                placeholder="ie. https://nfts.yoururl.com"
                                name="baseTokenURI"
                                .validators="${[
                                    new MinMaxLength({ min: 2, max: 30}),
                                    new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(30)}
                                class="big-input"
							></kana-input>
                        </span>
						<span>
                            <label>Suffix Token URI &#8505;</label>
                            <br/>
                            <kana-input
                                label-sr-only="Suffix Token URI"
                                placeholder="ie. .png, .jpeg, ..."
                                name="suffixTokenURI"
                                .validators="${[
                                    new MinMaxLength({ min: 3, max: 4}),
                                    new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(4)}
                            ></kana-input>
                        </span>
						<span>
							Example URL for NFT "test":
							https://nfts.yoururl.com/1.png
						</span>
                    </div>
                    <div class="form-row">
                        <span>
                            <label>Supply</label>
                            <br/>
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
                        </span>
                    </form>
            </kana-form>
        `;
    }
    
}