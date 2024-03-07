import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import "./icon.ts";

@customElement("loading-icon")
export class LoadingIcon extends LitElement {
  @property({ type: String })
  declare size: string;

  constructor() {
    super();
    this.size = "8rem";
  }

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
      <kana-icon class="loader" style="font-size: ${this.size}">
        sync
      </kana-icon>
    `;
  }
}