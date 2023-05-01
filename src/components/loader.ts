import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import "./icon";

@customElement("kana-loading-screen")
export class KanaLoadingScreen extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex: 1;
        z-index: 1;
      }

      .loader {
        display: inline-block;
        font-size: 8rem;
        color: #fff;
        animation: rotation 1.5s linear infinite;
      }

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(359deg);
        }
      }
    `;
  }

  render() {
    return html`
      <kana-icon class="loader">
        sync
      </kana-icon>
    `;
  }
}