var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { genSvgDataSrc } from './minidenticon';
let KanaWalletInfo = class KanaWalletInfo extends LitElement {
    _address;
    get address() {
        return this._address;
    }
    set address(addr) {
        this._address = addr;
        if (!this.imageUrl) {
            this.imageUrl =
                genSvgDataSrc(this._address);
        }
    }
    imageUrl;
    constructor(address) {
        super();
    }
    static get styles() {
        return css `
            :host {
                display: flex;
                align-items: center;
            }
            .wallet-img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 8px;
            }
            .wallet-address {
                display: inline-block;
                font-family: monospace;
            }
            kana-icon {
                margin-left: 8px;
            }
        `;
    }
    render() {
        const abridgedAddress = `${this.address?.slice(0, 6)}...${this.address?.slice(-4)}`;
        return html `
            <img class="wallet-img" 
                src="${this.imageUrl}" 
                alt="Wallet icon" />
            <span class="wallet-address">${abridgedAddress}</span>
            <kana-icon>menu</kana-icon>
        `;
    }
};
__decorate([
    property({ type: String })
], KanaWalletInfo.prototype, "address", null);
__decorate([
    property({ type: String })
], KanaWalletInfo.prototype, "imageUrl", void 0);
KanaWalletInfo = __decorate([
    customElement('kana-wallet-info')
], KanaWalletInfo);
export { KanaWalletInfo };
//# sourceMappingURL=wallet-info.js.map