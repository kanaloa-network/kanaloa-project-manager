var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
export class AbstractCardsPage extends LitElement {
    constructor() {
        super();
        this.items = [];
        this.isLoading = true;
    }
    static get styles() {
        return [
            css `
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 1rem;
                    flex: 1;
                }

                h1 {
                    font-size: 3rem;
                    display: block;
                    width: 100%;
                }

                .cards {
                    display: flex;
                    flex: 1;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: start;
                    align-items: start;
                    width: 100%;
                }

                kana-button {
                    min-width: fit-content;
                    width: 50%;
                    font-size: 1.5rem;
                    min-height: 4rem;
                    margin-bottom: 3rem;
                }
                
                a {
                    min-width: fit-content;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    text-decoration: none;
                }
            `,
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }
}
__decorate([
    property({ type: Array })
], AbstractCardsPage.prototype, "items", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], AbstractCardsPage.prototype, "isLoading", void 0);
//# sourceMappingURL=abstract-cards-page.js.map