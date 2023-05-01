var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { genSvgDataSrc } from './minidenticon';
let KanaWalletInfo = class KanaWalletInfo extends LitElement {
    _imageUrl;
    _computedIcon;
    get imageUrl() {
        return this._imageUrl || this._computedIcon;
    }
    set imageUrl(img) {
        this._imageUrl = img;
    }
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
                background-color: var(--foreground-color);
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
    connectedCallback() {
        super.connectedCallback();
        GlobalKanaloaEthers.subscribe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        GlobalKanaloaEthers.unsubscribe(this);
    }
    requestUpdate() {
        super.requestUpdate();
        const addr = GlobalKanaloaEthers.address?.toString();
        if (this._imageUrl == undefined) {
            this._computedIcon = (addr) ? genSvgDataSrc(addr) : undefined;
        }
    }
    render() {
        const address = GlobalKanaloaEthers.address?.toString();
        const abridgedAddress = (address != undefined) ?
            `${address.slice(0, 6)}...${address.slice(-4)}`
            : undefined;
        return when(abridgedAddress == undefined, () => html `
                <kana-button 
                    @click=${() => GlobalKanaloaEthers.requestSigner()}>
                    Connect wallet
                </kana-button>
            `, () => html `
                <img class="wallet-img" 
                    src="${this.imageUrl}" 
                    alt="Wallet icon" />
                <span class="wallet-address">${abridgedAddress}</span>
                <kana-icon>menu</kana-icon>`);
    }
};
__decorate([
    property({ type: String })
], KanaWalletInfo.prototype, "imageUrl", null);
KanaWalletInfo = __decorate([
    customElement('kana-wallet-info')
], KanaWalletInfo);
export { KanaWalletInfo };
//# sourceMappingURL=wallet-info.js.map