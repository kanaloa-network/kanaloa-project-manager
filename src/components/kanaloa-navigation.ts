import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property } from "lit/decorators.js"
import { LionButton } from "@lion/button";
import { navRoutes } from "../routes";
import { Shade, background } from './common-styles';
import "./icon";

@customElement("kana-nav-button")
class KanaNavButton extends LionButton {
    static get styles() {
        return [
            ...super.styles
        ];
    }
}

@customElement('kanaloa-navigation')
export default class KanaloaNavigation extends LitElement {

    @property({ reflect: true, type: Boolean })
    declare opened: boolean;

    constructor() {
        super();
        this.opened = false;
    }

    static get styles() {
        return [
            css`
                :host {
                    width: var(--nav-width-collapsed);
                    transition: width 0.3s ease-in-out;
                    padding: 1rem;
                }
    
                :host([opened]) {
                    width: var(--nav-width-expanded);
                }
    
                nav {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                    
                #logo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 2rem 0 2.5rem 0;
                }

                #logo-container img {
                    max-width: 100%;
                    height: auto;
                }

                nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
    
                nav li {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
    
                nav li a {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: inherit;

                    transition: all 300ms ease;
                    transition-property: opacity;

                    &:hover {
                        transition: all 300ms ease;
                        transition-property: opacity;

                        opacity: 0.8;
                    }
                }
    
                kana-icon {
                    margin-right: 1rem;
                }
            `,
            css`
                :host {
                    --nav-width-collapsed: 90px;
                    --nav-width-expanded: 200px;
                }
            `,
            background(Shade.LIGHT)
        ];
    }
    
    render() {
        return html`
            <div id="logo-container">
                <a href="/">
                    <img src="/media/img/logo.png" alt="Kanaloa Network logo" />
                </a>
            </div>
            <nav>
                <ul>
                    ${repeat(navRoutes, (r) => r.path, (r) => html`
                        <li>
                            <a href="${r.path}">
                                <kana-icon>${r.icon}</kana-icon>
                                ${r.name}
                            </a>
                        </li>
                    `)}
                </ul>
            </nav>
        `;
    }
    
}
