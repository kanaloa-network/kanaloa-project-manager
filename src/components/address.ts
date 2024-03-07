import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('evm-address')
export class EvmAddress extends LitElement {
    @property({ type: String })
    declare address: string;
    @property({ type: Boolean })
    declare abridged: boolean;
    @property({ type: Boolean })
    declare clipboard: boolean;
    @property({ type: Boolean })
    declare tooltip: boolean;
    
    constructor() {
        super();
        this.address = "";
        this.abridged = false;
        this.clipboard = false;
        this.tooltip = false;
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                align-items: center;
                position: relative;
            }

            .wallet-address {
                display: inline-block;
                font-family: monospace;
            }

            kana-icon {
                margin-left: 8px;
                cursor: pointer;
            }

            .tooltip {
                position: absolute;
                right: 0;
                bottom: 100%;
                transform: translateY(5px);
                background-color: #555;
                color: white;
                text-align: center;
                border-radius: 6px;
                padding: 5px;
                z-index: 1;
                opacity: 0;
                transition: opacity 0.3s;
            }
          
            .tooltip.show {
                opacity: 1;
            }
        `;
    }

    protected async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.address);
            this.showTooltip();
            console.log('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    showTooltip() {
        this.tooltip = true;
        setTimeout(() => {
          this.tooltip = false;
        }, 1000);
    }

    render() {
        return html`
            <span class="wallet-address">
                ${(this.abridged) ? 
                    `${this.address.slice(0, 7)}...${this.address.slice(-5)}`
                    : this.address}
            </span>
            ${(this.clipboard) ? 
                html`
                    <kana-icon 
                        @click=${this.copyToClipboard}
                        size="inherit"
                    >
                        content_copy
                    </kana-icon>
                    <div class="tooltip ${this.tooltip ? 'show' : ''}">
                        Copied!
                    </div>
                ` 
                : ""}
        `
    }
}
