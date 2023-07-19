import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { colorVariables } from './components/common-styles';
import { routes } from './routes';
import { Router } from '@vaadin/router';
import { KanaloaEthers } from "./api/kanaloa-ethers";
import './components/kanaloa-navigation';
import './components/kanaloa-display';
import "@material/web/icon/icon.js";

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
                    overflow-y: hidden;
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


document.querySelector('body')?.appendChild(new KanaloaApp());