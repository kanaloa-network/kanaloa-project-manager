import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('kana-icon')
export class KanaIcon extends LitElement {
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
                    font-size: 24px;
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
        return html`<span><slot></slot></span>`;
    }
}