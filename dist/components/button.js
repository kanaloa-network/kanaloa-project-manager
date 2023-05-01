var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LionButton, LionButtonSubmit } from "@lion/button";
import { css } from "lit";
import { customElement } from "lit/decorators.js";
import { interactiveComponentHighlight } from "./common-styles";
const commonButtonCss = [
    css `
        :host(:hover) {
            background-color: var(--highlighted-light-color);
            color: var(--background-light-color);
        }

        :host(:active), :host([active]) {
            background-color: var(--highlighted-dark-color);
            color: var(--foreground-color);
        }

        :host {
            justify-content: center;
            align-items: center;
            border-radius: 5px;
        }
    `,
    interactiveComponentHighlight()
];
let KanaButton = class KanaButton extends LionButton {
    static get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ];
    }
};
KanaButton = __decorate([
    customElement("kana-button")
], KanaButton);
export { KanaButton };
let KanaButtonSubmit = class KanaButtonSubmit extends LionButtonSubmit {
    static get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ];
    }
};
KanaButtonSubmit = __decorate([
    customElement("kana-button-submit")
], KanaButtonSubmit);
export { KanaButtonSubmit };
//# sourceMappingURL=button.js.map