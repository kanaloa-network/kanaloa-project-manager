import { html, css, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('kana-icon')
export class KanaIcon extends LitElement {
    @property({ type: String })
    declare size: string;

    static get styles() {
        return [
            css`
                @font-face {
                    font-family: 'Material Icons';
                    font-style: normal;
                    font-weight: 400;
                    src: url("material-icons.ttf") format('truetype');
                }
                
                :host {
                    font-family: 'Material Icons';
                    font-weight: normal;
                    font-style: normal;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                }
            ` 
        ]
    }
    override render() {
        return html`
            <span style="${(this.size) ? `font-size: ${this.size}` : nothing}">
                <slot></slot>
            </span>
        `;
    }
}