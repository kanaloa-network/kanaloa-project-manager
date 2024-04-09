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
        return "123"; // TODO
    }
    
    static get initializerABI(): Map<string, string> {
        return new Map([
            ["name", "string"],
			["symbol", "string"], 
            ["baseTokenURI", "string"],
			["suffixTokenURI", "string"],
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
                    model.suffixTokenURI,
                    BigInt(model.maxSupply) * 10n ** 18n // TODO
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
                                name="_symbol"
                                .validators="${[
                                    new MinMaxLength({ min: 2, max: 8}),
                                    new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(8)}
                                class="small-input"
                            ></kana-input>
                        </span>
                    </div>
                    <div class="form-row">
                        <span>
                            <label>Supply</label>
                            <br/>
                            <kana-input-amount
                                label-sr-only="Supply"
                                placeholder="21000000"
                                name="_supply"
                                .validators="${[
                                    new MinNumber(1),
                                    new MaxNumber(MaxUint256),
                                    new Required()
                                ]}"
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                .modelValue=${21000000}
                            ></kana-input-amount>
                        </span>
                        <span>
                            <label>Token decimals</label>
                            <br/>
                            <kana-input-stepper
                                label-sr-only="Token decimals"
                                value="18"
                                name="_decimals"
                                .validators="${[
                                    new Required()
                                ]}"
                                min="0"
                                max="32"
                            ></kana-input-stepper>
                        </span>
                    </form>
            </kana-form>
        `;
    }
    
}