import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { colorVariables } from './components/common-styles';
import { routes } from './routes';
import { Router } from '@vaadin/router';
import { KanaloaEthers } from "./api/kanaloa-ethers";
import './components/kanaloa-navigation';
import './components/kanaloa-display';
import "@material/web/icon/icon.js";

import reseter from "../css/reseter.module.css";
import materialIcons from "../css/material-icons.module.css";

@customElement('kanaloa-app')
export class KanaloaApp extends LitElement {
    router: Router;
    constructor() {
        super();
        this.router = new Router();
    }


    static get styles() {
        return [
            colorVariables,
            css`
                :host {
                    display: flex;
                    height: 100%;
                }
            `
        ];
    }

    firstUpdated() {
        this.router.setRoutes(routes);
    }
    
    render() {
        return html`
            <kanaloa-navigation opened></kanaloa-navigation>
            <kanaloa-display 
                .router=${this.router}
            >
            </kanaloa-display>
        `;
    }
}

// Forgive me, Terry, for I have sinned
(() => {
    const tag = document.createElement("style");
    tag.innerText = `
        html, body {
            height: 100%;
        }
        ${reseter}
        ${materialIcons}
    `;
    document.head.appendChild(tag);
})();

document.querySelector('body')?.appendChild(new KanaloaApp());