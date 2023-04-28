var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { foreground } from './common-styles';
import "./minidenticon";
let KanaCard = class KanaCard extends LitElement {
    name;
    description;
    images = [];
    buttonText;
    constructor(props) {
        super();
        if (props) {
            this.name = props.name || this.name;
            this.description = props.description || this.description;
            this.images = props.images || this.images;
            this.buttonText = props.buttonText || this.buttonText;
        }
    }
    static get styles() {
        return [
            css `
                :host {
                    display: block;
                    background-color: var(--foreground-color);
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    max-width: 300px;
                    max-height: 500px;
                    margin-bottom: 1rem;
                }

                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .description {
                    height: 4rem;
                    max-width: 100%;
                    overflow: scroll;
                    overflow-wrap: break-word;
                    position: relative;
                }

                .description::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2rem;
                    background-image: linear-gradient(to top, var(--foreground-color), transparent);
                }

                .images {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    height: 128px;
                    justify-content: center;
                }

                identicon-img {
                    height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                kana-button {
                    display: block;
                    margin-top: 1rem;
                }
            `,
            foreground(),
        ];
    }
    render() {
        return html `
            <div class="title-row">
                <h2>${this.name}</h2>
                <kana-icon>settings</kana-icon>
            </div>
            <div class="description">
                ${this.description}
            </div>
            <div class="images">
                <identicon-img hash="${this.name}"></identicon-img>
            </div>
            <kana-button>${this.buttonText}</kana-button>
        `;
    }
};
__decorate([
    property({ type: String })
], KanaCard.prototype, "name", void 0);
__decorate([
    property({ type: String })
], KanaCard.prototype, "description", void 0);
__decorate([
    property({ type: Array })
], KanaCard.prototype, "images", void 0);
__decorate([
    property({ type: String })
], KanaCard.prototype, "buttonText", void 0);
KanaCard = __decorate([
    customElement('kana-card')
], KanaCard);
export { KanaCard };
//# sourceMappingURL=card.js.map