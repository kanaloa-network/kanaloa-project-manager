import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { KanaloaAPI } from '../api/kanaloa-ethers';
import { genSvgDataSrc } from './minidenticon';

@customElement('kana-wallet-info')
export class KanaWalletInfo extends LitElement {
    @property({ type: String })
    imageUrl?: string;

    constructor() {
        super();
        KanaloaAPI.subscribe(this);
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

            a {
                text-decoration: none;
                color: inherit;
            }
        `;
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        KanaloaAPI.unsubscribe(this);
    }

    render() {
        const connectButton =
            html`
                <kana-button 
                    @click=${() => KanaloaAPI.requestSigner()}>
                    Connect wallet
                </kana-button>
            `
        ;

        return until(
            KanaloaAPI.signer
                .then((s) => s?.getAddress())
                .then((a) => {
                    if (!a) { return Promise.reject() }
                    return html`
                        <img class="wallet-img" 
                            src="${this.imageUrl as string || genSvgDataSrc(a)}" 
                            alt="Wallet icon" />
                        <span class="wallet-address">
                            ${a.slice(0, 6)}...${a.slice(-4)}
                        </span>
                        <kana-icon><a href="/projects">menu</a></kana-icon>
                    `
                })
                .catch(() => connectButton)
            , connectButton 
        );
    }
}
