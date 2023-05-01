import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { KanaCard } from 'src/components/card';

export abstract class AbstractCardsPage extends LitElement {
    @property({ type: Array })
    declare items: KanaCard[];

    @property({ type: Boolean, reflect: true })
    declare isLoading: boolean;

    constructor() {
        super();
        this.items = [];
        this.isLoading = true;
    }

    abstract fetchData(): Promise<void>;

    static get styles() {
        return [
            css`
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
