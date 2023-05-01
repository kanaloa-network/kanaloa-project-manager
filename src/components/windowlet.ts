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
                    width: 60%;
                    max-width: 30rem;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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