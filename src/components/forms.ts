import { LionForm } from "@lion/form";
import { LionInput} from "@lion/input";
import { LionOption, LionOptions } from'@lion/select-rich';
import { LionSelect } from'@lion/select';
import { customElement } from "lit/decorators.js";
import { css, CSSResult } from "lit";
import { interactiveComponent } from "./common-styles";

const flexifyCss: CSSResult =
    css`
        :host {
            display: inline-flex;
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

export function maxLengthPreprocessor(maxLength: number = Infinity) {
    return (value: string) => {
        return value.slice(0, maxLength);
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
        ]
    }
}

@customElement("kana-input")
export class KanaInput extends LionInput {
    static override get styles() {
        return [
            flexifyCss
        ]
    }
}

@customElement("kana-options")
export class KanaOptions extends LionOptions {
    static override get styles() {
        return [
            flexifyCss
        ]
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
        ]
    }
}
