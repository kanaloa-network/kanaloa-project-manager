import { LitElement, html, css, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { foreground, Shade } from './common-styles';
import "./minidenticon";
import { ifDefined } from 'lit/directives/if-defined.js';

interface ButtonProps {
    link?: string;
    text: string;
}

interface ProjectCardProps {
    name?: String;
    description?: String;
    images?: String[];
    button?: ButtonProps;
    address?: string;
}

@customElement('kana-card')
export class KanaCard extends LitElement {

    @property({ type: String })
    declare name?: String;
    @property({ type: String })
    declare description?: String;
    @property({ type: Array }) 
    declare images: String[];
    @property() 
    declare button: ButtonProps;
    @property({ type: String }) 
    declare address?: string;

    constructor(props?: ProjectCardProps) {
        super();

        if (props) {
            this.name = props.name || this.name;
            this.description = props.description || this.description;
            this.images = props.images || this.images || [];
            this.button = props.button || this.button;
            this.address = props.address;
        }
    }

    static get styles() {
        return [
            css`
                :host {
                    display: block;
                    background-color: var(--foreground-color);
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 270px;
                    height: 370px;
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

                a {
                    text-decoration: none;
                }
            `,
            foreground(),
        ];
    }

    render() {
        return html`
            <div class="title-row">
                <h2>${this.name}</h2>
                <kana-icon>settings</kana-icon>
            </div>
            <div class="description">
                ${this.description}
            </div>
            <div class="images">
                <identicon-img hash="${ifDefined(this.address)}">
                </identicon-img>
            </div>
            <a href="${ifDefined(this.button.link)}">
                <kana-button>
                    ${this.button.text}
                </kana-button>
            </a>
        `;
    }
}
