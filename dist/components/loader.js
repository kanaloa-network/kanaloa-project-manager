var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import "./icon";
let KanaLoadingScreen = class KanaLoadingScreen extends LitElement {
    static get styles() {
        return css `
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
        return html `
      <kana-icon class="loader">
        sync
      </kana-icon>
    `;
    }
};
KanaLoadingScreen = __decorate([
    customElement("kana-loading-screen")
], KanaLoadingScreen);
export { KanaLoadingScreen };
//# sourceMappingURL=loader.js.map