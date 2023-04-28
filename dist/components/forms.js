var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LionForm } from "@lion/form";
import { LionInput } from "@lion/input";
import { LionOption, LionOptions } from '@lion/select-rich';
import { LionSelect } from '@lion/select';
import { customElement } from "lit/decorators.js";
import { css } from "lit";
const flexifyCss = css `
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
    `;
let KanaForm = class KanaForm extends LionForm {
};
KanaForm = __decorate([
    customElement("kana-form")
], KanaForm);
export { KanaForm };
let KanaInput = class KanaInput extends LionInput {
    static get styles() {
        return [
            flexifyCss
        ];
    }
};
KanaInput = __decorate([
    customElement("kana-input")
], KanaInput);
export { KanaInput };
let KanaOptions = class KanaOptions extends LionOptions {
    static get styles() {
        return [
            flexifyCss
        ];
    }
};
KanaOptions = __decorate([
    customElement("kana-options")
], KanaOptions);
export { KanaOptions };
let KanaOption = class KanaOption extends LionOption {
};
KanaOption = __decorate([
    customElement("kana-option")
], KanaOption);
export { KanaOption };
let KanaSelect = class KanaSelect extends LionSelect {
    static get styles() {
        return [
            css `
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
        ];
    }
};
KanaSelect = __decorate([
    customElement("kana-select")
], KanaSelect);
export { KanaSelect };
//# sourceMappingURL=forms.js.map