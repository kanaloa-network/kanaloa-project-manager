import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { genSvgDataSrc } from './minidenticon';

@customElement('kana-wallet-info')
export class KanaWalletInfo extends LitElement {

    private _address?: String;
    @property({ type: String }) 
    get address(): String | undefined {
        return this._address;
    }
    set address(addr: String | undefined) {
        this._address = addr;
        if (!this.imageUrl) {
            this.imageUrl = 
                genSvgDataSrc(this._address as string);
        }
    }

    @property({ type: String }) 
    imageUrl?: String;

    constructor(address: String) {
        super();
    }

    static get styles() {
        return css`
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

        return html`
            <img class="wallet-img" 
                src="${this.imageUrl}" 
                alt="Wallet icon" />
            <span class="wallet-address">${abridgedAddress}</span>
            <kana-icon>menu</kana-icon>
        `;
    }
}
