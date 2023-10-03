import { customElement } from "lit/decorators.js";
import { ModuleForm } from "./commons";
import { html } from "lit";
import { Required, maxLengthPreprocessor, maxNumberPreprocessor } from "../forms/forms";
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

    render() {
        return html`
            <div class="form-row">
                <kana-input
                    label-sr-only="Symbol"
                    placeholder="Symbol"
                    name="symbol"
                    .validators="${[
                        new MinMaxLength({ min: 2, max: 8}),
                        new Required()
                    ]}"
                    .preprocessor=${maxLengthPreprocessor(8)}
                    class="small-input"
                ></kana-input>
                <kana-select
                    label-sr-only="Supply type"
                    name="supply-type"
                    placeholder="Supply type"
                    .validators=${[ new Required() ]}
                >
                    <select name="supply-type" slot="input">
                        <option hidden selected>
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
                <kana-input-amount
                    label-sr-only="Maximum supply"
                    placeholder="Maximum supply"
                    name="max-supply"
                    .validators="${[
                        new MinNumber(0),
                        new MaxNumber(MaxUint256),
                        new Required()
                    ]}"
                    .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                ></kana-input-amount>
                <kana-input-stepper
                    label="Decimals"
                    label-sr-only="Token decimals"
                    value="18"
                    name="decimals"
                    .validators="${[
                        new Required()
                    ]}"
                    min="0"
                    max="32"
                ></kana-input-stepper>
                <pulpito-input type="select">
                    <option>test</option>
                </pulpito-input>
            </div>
        `;
    }
    
}