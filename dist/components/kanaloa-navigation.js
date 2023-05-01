var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property } from "lit/decorators.js";
import { LionButton } from "@lion/button";
import { navRoutes } from "../routes";
import { background } from './common-styles';
import "./icon";
let KanaNavButton = class KanaNavButton extends LionButton {
    static get styles() {
        return [
            ...super.styles
        ];
    }
};
KanaNavButton = __decorate([
    customElement("kana-nav-button")
], KanaNavButton);
let KanaloaNavigation = class KanaloaNavigation extends LitElement {
    constructor() {
        super();
        this.opened = false;
    }
    static get styles() {
        return [
            css `
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
                    margin-bottom: 1rem;
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
                }
    
                kana-icon {
                    margin-right: 1rem;
                }
            `,
            css `
                :host {
                    --nav-width-collapsed: 90px;
                    --nav-width-expanded: 200px;
                }
            `,
            background("-light" /* Shade.LIGHT */)
        ];
    }
    render() {
        return html `
            <div id="logo-container">
                <img src="/media/img/logo.png" alt="Kanaloa Network logo" />
            </div>
            <nav>
                <ul>
                    ${repeat(navRoutes, (r) => r.path, (r) => html `
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
};
__decorate([
    property({ reflect: true, type: Boolean })
], KanaloaNavigation.prototype, "opened", void 0);
KanaloaNavigation = __decorate([
    customElement('kanaloa-navigation')
], KanaloaNavigation);
export default KanaloaNavigation;
//# sourceMappingURL=kanaloa-navigation.js.map