import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { genSvgDataSrc } from './minidenticon';

@customElement('kana-wallet-info')
export class KanaWalletInfo extends LitElement {
    _imageUrl?: String;
    _computedIcon?: String;
    @property({ type: String })
    get imageUrl(): String | undefined {
        return this._imageUrl || this._computedIcon;
    }
    set imageUrl(img: String | undefined) {
        this._imageUrl = img;
    }

    constructor(address: String) {
        super();
        GlobalKanaloaEthers.subscribe(this);
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
                background-color: var(--foreground-color);
            }
            .wallet-address {
                display: inline-block;
                font-family: monospace;
            }
			.menu-link {
				text-decoration: none;
				color: inherit;
			}
            kana-icon {
                margin-left: 8px;
            }
        `;
    }

    disconnectedCallback(): void {
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
        const address: String | undefined = GlobalKanaloaEthers.address?.toString();
        const abridgedAddress = 
            (address != undefined) ?
                `${address.slice(0, 6)}...${address.slice(-4)}`
                : undefined;

        return when(
            abridgedAddress == undefined,
            () => html`
                <kana-button 
                    @click=${() => GlobalKanaloaEthers.requestSigner()}>
                    Connect wallet
                </kana-button>
            `,
            () => html`
                <img class="wallet-img" 
                    src="${this.imageUrl as string}" 
                    alt="Wallet icon" />
                <span class="wallet-address">${abridgedAddress}</span>
				<a href="profile" class="menu-link">
					<kana-icon>menu</kana-icon>
				</a>`
        );
    }
}
