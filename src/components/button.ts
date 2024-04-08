import { LionButton, LionButtonSubmit } from "@lion/button";
import { CSSResult as LionCSSResult } from "@lion/core";
import { css, CSSResult } from "lit";
import { customElement } from "lit/decorators.js";
import { interactiveComponentHighlight } from "./common-styles"

const commonButtonCss: CSSResult[] = [
    css`
        :host(:hover) {
            background-color: var(--highlighted-light-color);
            color: var(--background-light-color);

			transition: all 300ms ease;
			transition-property: background-color, color;
        }

        :host(:active), :host([active]) {
            background-color: var(--highlighted-dark-color);
            color: var(--foreground-color);

			transition: all 300ms ease;
			transition-property: background-color, color;
        }

        :host {
            justify-content: center;
            align-items: center;
            border-radius: 5px;
			cursor: pointer;

			transition: all 300ms ease;
			transition-property: background-color, color;
        }
    `,
    interactiveComponentHighlight()
];


@customElement("kana-button")
export class KanaButton extends LionButton {
    static formAssociated = true;
    
    static override get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ] as LionCSSResult[];
    }
}

@customElement("kana-button-submit")
export class KanaButtonSubmit extends LionButtonSubmit {
    static formAssociated = true;
    private internals?: ElementInternals;

    constructor() {
        super();

    }

    static override get styles() {
        return [
            ...super.styles,
            ...commonButtonCss
        ] as any;
    }

}