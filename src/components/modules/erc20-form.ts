import { customElement } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { html } from "lit";
import { KanaForm, KanaInputAmount, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import "../forms/pulpito/pulpito-input";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { KanaloaAPI } from "../../api/kanaloa-ethers";

export const ERC20_FORM_TAG = 'erc20-form';
@customElement(ERC20_FORM_TAG)
export class ERC20Form extends ModuleForm {
    static formAssociated = true;

    constructor() {
        super();
        
    }

    static get moduleSignature(): string {
        return "0xa7ea6982eb398487d571bb8d7880d038a52a2e20501e5d89251b0d77e2179769";
    }
    
    static get initializerABI(): Map<string, string> {
        return new Map([
            [ "_name", "string" ], [ "_symbol", "string" ], 
            [ "_decimals", "uint8" ], ["_supply", "uint256"], 
            [ "_mintTo", "address" ]
        ]);
    }

    get moduleSignature(): string {
        return ERC20Form.moduleSignature;
    }

    get initializerABI(): Map<string, string> {
        return ERC20Form.initializerABI;
    }

    async compileModuleParameters(root: any): Promise<ModuleParameters | null> {
        const form = this.kanaForm;

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
            moduleSignature: ERC20Form.moduleSignature,
            initParams: ethers.AbiCoder.defaultAbiCoder().encode(
                Array.from(ERC20Form.initializerABI.values()),
                [ 
                    root.name, model._symbol, 
                    model._decimals, 
                    BigInt(model._supply) * 10n ** BigInt(model._decimals),
                    await (await KanaloaAPI.signer)!.getAddress()
                ]
            )
        };
    }

    render() {
        return html`
            <h2>ERC20 module</h2>
            <hr>
            <h3>The fungible token standard</h3>
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