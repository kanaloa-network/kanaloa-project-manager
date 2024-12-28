import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { KanaloaAPI } from '../api/kanaloa-ethers';
import { genSvgDataSrc } from './minidenticon';
import "./icon";
import './address';

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

                transition: all 300ms ease;
                transition-property: opacity;

                &:hover {
                    opacity: 0.8;

                    transition: all 300ms ease;
                    transition-property: opacity;
                }
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
                        <evm-address address="${a}" abridged></evm-address>
                        <kana-icon><a href="/projects">menu</a></kana-icon>
                    `
                })
                .catch(() => connectButton)
            , connectButton 
        );
    }
}
