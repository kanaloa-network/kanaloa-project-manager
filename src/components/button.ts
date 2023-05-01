import { LionButton, LionButtonSubmit } from "@lion/button";
import { css, CSSResult } from "lit";
import { customElement } from "lit/decorators.js";
import { interactiveComponentHighlight } from "./common-styles"

const commonButtonCss: CSSResult[] = [
    css`
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


@customElement("kana-button")
export class KanaButton extends LionButton {
    static override get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ];
    }
}

@customElement("kana-button-submit")
export class KanaButtonSubmit extends LionButtonSubmit {
    static override get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ];
    }
}