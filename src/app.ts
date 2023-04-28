import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { colorVariables } from './components/common-styles';
import routes from './routes';
import { Router } from '@vaadin/router';
import './components/kanaloa-navigation';
import './components/kanaloa-display';
import "@material/web/icon/icon.js";

@customElement('kanaloa-app')
export class KanaloaApp extends LitElement {
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

    router: Router;

    constructor() {
        super();
        this.router = new Router();
    }

    firstUpdated() {
        this.router.setRoutes(routes);
    }
    
    render() {
        return html`
            <kanaloa-navigation opened></kanaloa-navigation>
            <kanaloa-display .router=${this.router}></kanaloa-display>
        `;
    }
}


document.querySelector('body')?.appendChild(new KanaloaApp());