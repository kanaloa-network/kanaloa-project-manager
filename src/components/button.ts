import { LionButton } from "@lion/button";
import { css } from "lit";
import { customElement } from "lit/decorators.js";
import { interactiveComponentHighlight } from "./common-styles"

@customElement("kana-button")
export class KanaButton extends LionButton {
    static override get styles() {
        return [
            ...super.styles,
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
                }
            `,
            interactiveComponentHighlight()
        ];
    }
}