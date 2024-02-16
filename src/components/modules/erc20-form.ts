import { customElement } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { html } from "lit";
import { KanaForm, KanaInputAmount, Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
import { MinMaxLength, MinNumber, MaxNumber } from "@lion/form-core";
import { MaxUint256 } from "ethers";
import "../forms/pulpito/pulpito-input";

export const ERC20_FORM_TAG = 'erc20-form';
@customElement(ERC20_FORM_TAG)
export class ERC20Form extends ModuleForm {
    static formAssociated = true;

    constructor() {
        super();
        
    }

    value() {
        const model = new FormData(this.shadowRoot!.querySelector("form")!);
        return {
            symbol: model.get("symbol")!.toString(),
            decimals: model.get("decimals")!.toString(),
            supply: 
                BigInt((this.shadowRoot!.querySelector("[name=max-supply]")! as KanaInputAmount).modelValue) * BigInt(10) ** BigInt(model.get("decimals")!.toString()),
        }
    }

    render() {
        return html`
            <h2>ERC20 module</h2>
            <hr>
            <h3>The fungible token standard</h3>
            <kana-form>

            <form>
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
                        class="small-input"
                    ></kana-input>
                </span>
                <span>
                    <kana-select
                        label-sr-only="Supply type"
                        name="supply-type"
                        placeholder="Supply type"
                        .validators=${[ new Required() ]}
                    >
                        <select name="supply-type" slot="input">
                            <option hidden selected value>
                                Select supply type
                            </option>
                            <option value="fixed">
                                Fixed supply
                            </option>
                            <option hidden value="variable">
                                Variable supply
                            </option>
                        </select>
                    </kana-select>
                </div>
                <div class="form-row">
                    <span>
                        <label>Maximum supply</label>
                        <br/>
                        <kana-input-amount
                            label-sr-only="Maximum supply"
                            placeholder="Maximum supply"
                            name="max-supply"
                            .validators="${[
                                new MinNumber(1),
                                new MaxNumber(MaxUint256),
                                new Required()
                            ]}"
                            .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                        ></kana-input-amount>
                    </span>
                    <span>
                        <label>Token decimals</label>
                        <br/>
                        <kana-input-stepper
                            label-sr-only="Token decimals"
                            value="18"
                            name="decimals"
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