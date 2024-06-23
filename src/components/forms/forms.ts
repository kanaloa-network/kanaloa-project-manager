import { LionForm } from "@lion/form";
import { LionInput } from "@lion/input";
import { LionOption, LionOptions } from'@lion/select-rich';
import { LionSelect } from'@lion/select';
import { LionTooltip } from '@lion/tooltip';
import { LionInputStepper } from "@lion/input-stepper";
import { customElement } from "lit/decorators.js";
import { css, CSSResult } from "lit";
import { Required as VanillaRequired } from "@lion/form-core";
import { LionInputAmount } from '@lion/input-amount';
import { headerStyles, interactiveComponent } from "../common-styles";
import { CSSResultArray } from "@lion/core";

const flexifyCss: CSSResult =
    css`
        :host {
            display: inline-flex;
            position: relative;
        }

        :host * {
            display: inline-flex;
        }

        /* Can't believe ING would make something so ugly */
        .input-group,
        .form-field__group-two, 
        .input-group__container, 
        .input-group__input,
        .input-group__input * {
            flex: 1;
        }
    `
;

export const formCssCommon = [
    headerStyles,
    css`
        kana-input, input, kana-select {
            flex: 1;
            font-size: 1rem;
            position: relative;
            font-family: Poppins;
        }

        input, select {
            font-family: Poppins;
        }

        input {
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--primary-color);
            color: var(--foreground-color);
            box-sizing: border-box;
        }
        
        input:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--highlighted-light-color);
        }

        .small-input, .small-input * {
            flex: 0;
        }

        .small-input input {
            width: 8rem;
        }

        .form-row {
            display: flex;
            gap: 1rem;
            margin: 10px 0;
            flex-flow: row wrap;
        }

        .form-new {
            display: flex;
            flex-direction: column;
            gap: 20px;

            margin-top: 20px;
        }

        .form-element-new {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .form-column-new {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form-row-new {
            display: flex;
            flex-direction: row;
            gap: 10px;
        }

        label[slot="invoker"] {
            cursor: pointer;
        }

        div[slot='content'] {
            background-color: var(--highlighted-color);
            color: var(--foreground-color);
            padding: 6px;
            font-size: 12px;
            border-radius: 5px;
            box-shadow: 0px 0px 15px rgb(0 0 0 / 15%);
        }

        select {
            padding: 10px;
            padding-right: 2rem;
            border: none;
            border-radius: 10px;
            background-color: var(--primary-color);
            color: var(--foreground-color);
            font-size: 1rem;
            appearance: none;
            cursor: pointer;
            flex: 1;
            font-size: 18px;
        }
        
        select:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--highlighted-light-color);
        }
        
        kana-button-submit {
            min-width: fit-content;
            flex: 1;
            font-size: 1.2rem;
            min-height: 3rem;
        }

        ::placeholder {
            color: var(--foreground-color);
            opacity: 0.6;
        }
    `,
    css`
        .form-row lion-validation-feedback,
        .form-element-new lion-validation-feedback {
            position: absolute;
            background-color: var(--highlighted-light-color);
            color: var(--background-color);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
            max-width: 12rem;
            font-size: 0.8rem;
            line-height: 1.2;
            bottom: 2rem;
            margin-left: -3rem;
            width: max-content;
            z-index: 1
        }

        .form-row lion-validation-feedback:not([type="error"]),
        .form-element-new lion-validation-feedback:not([type="error"]) {
            display: none;
        }
        
        .form-row lion-validation-feedback::before,
        .form-element-new lion-validation-feedback::before {
            content: '';
            position: absolute;
            bottom: -18px;
            left: 10%;
            margin-left: -10px;
            border: 10px solid transparent;
            border-top: 15px solid var(--highlighted-light-color);
        }
        
    `
];

export function maxLengthPreprocessor(maxLength: number = Infinity) {
    return (value: string) => {
        return value.slice(0, maxLength);
    }
}

export function maxNumberPreprocessor(maxNumber: bigint) {
    return (value: string) => {
        if (value !== "") {
            let cutValue = value.split(".")[0];
            let sanitizedValue: bigint = BigInt(cutValue.replace(/[^0-9]/g, ''));
            if (sanitizedValue > maxNumber) {
                sanitizedValue = maxNumber;
            }
            return sanitizedValue.toString();
        } else {
            return "";
        }
    }
}


@customElement("kana-form")
export class KanaForm extends LionForm {
    static override get styles() {
        return [
            flexifyCss,
            css`
                ::slotted(form), .input-group * {
                    flex: 1;
                }
                
            `
        ] as unknown as CSSResultArray
    }
}

@customElement("kana-input")
export class KanaInput extends LionInput {
    static override get styles() {
        return [
            flexifyCss
        ] as unknown as CSSResultArray
    }
}

@customElement("kana-options")
export class KanaOptions extends LionOptions {
    static override get styles() {
        return [
            flexifyCss
        ] as unknown as CSSResultArray
    }
}

@customElement("kana-option")
export class KanaOption extends LionOption {

}

@customElement("kana-select")
export class KanaSelect extends LionSelect {
    static override get styles() {
        return [
            css`
                :host {
                    position: relative;
                    display: inline-flex;
                }
                :host::after {
                    content: '';
                    display: block;
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 7px solid var(--foreground-color);
                    pointer-events: none;
               }
            `,
            flexifyCss
        ] as unknown as CSSResultArray
    }
}

@customElement("kana-input-amount")
export class KanaInputAmount extends LionInputAmount {
    static override get styles() {
        return [
            flexifyCss
        ]
    }
}

// @ts-ignore
@customElement("kana-input-stepper")
export class KanaInputStepper extends LionInputStepper {
    static override get styles() {
        return [
            flexifyCss
        ]
    }
}

@customElement("kana-tooltip")
export class KanaTooltip extends LionTooltip {
    static override get styles() {
        return [
            flexifyCss
        ]
    }
}

export const Required = (() => {
    VanillaRequired.getMessage = async () => {
        return "Please, enter a value";
    }

    return VanillaRequired;
})();