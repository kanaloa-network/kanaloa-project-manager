var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { colorVariables } from './components/common-styles';
import routes from './routes';
import { Router } from '@vaadin/router';
import './components/kanaloa-navigation';
import './components/kanaloa-display';
import "@material/web/icon/icon.js";
let KanaloaApp = class KanaloaApp extends LitElement {
    static get styles() {
        return [
            colorVariables,
            css `
                :host {
                    display: flex;
                    height: 100%;
                    overflow-y: hidden;
                }
            `
        ];
    }
    router;
    constructor() {
        super();
        this.router = new Router();
    }
    firstUpdated() {
        this.router.setRoutes(routes);
    }
    render() {
        return html `
            <kanaloa-navigation opened></kanaloa-navigation>
            <kanaloa-display .router=${this.router}></kanaloa-display>
        `;
    }
};
KanaloaApp = __decorate([
    customElement('kanaloa-app')
], KanaloaApp);
export { KanaloaApp };
document.querySelector('body')?.appendChild(new KanaloaApp());
//# sourceMappingURL=app.js.map