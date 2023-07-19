import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("kana-windowlet")
export class KanaloaWindowlet extends LitElement {
    static get styles() {
        return [
            css`
                :host {
                    background-color: var(--foreground-color);
                    color: var(--background-color);
                    border-radius: 1rem;
                    padding: 1rem;
                    display: flex;
                    flex: 1 1 auto;
                    width: 32rem;
                    max-width: 100%;
                    flex-direction: column;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;
                }
            `
        ]
    }
    render() {
        return html`
            <slot></slot>
        `;
    }
}