var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from "lit/decorators.js";
import { background } from './common-styles';
import { createRef, ref } from 'lit/directives/ref.js';
import "./wallet-info";
let KanaloaDisplay = class KanaloaDisplay extends LitElement {
    outlet = createRef();
    router;
    constructor() {
        super();
    }
    static get styles() {
        return [
            css `
                :host {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    padding: 1rem;
                }

                kanaloa-outlet {
                    display: flex;
                    flex-grow: 1;
                    margin-left: 2rem;
                }
                
                .top-bar {
                    display: flex;
                    justify-content: end;
                }
            `,
            background("-dark" /* Shade.DARK */)
        ];
    }
    updated() {
        this.router?.setOutlet(this.outlet.value);
    }
    render() {
        return html `
            <div class="top-bar">
                <kana-wallet-info address="0x0000000000000000000000000"></kana-wallet-info>
            </div>
            <kanaloa-outlet ${ref(this.outlet)}></kanaloa-outlet>
        `;
    }
};
__decorate([
    property()
], KanaloaDisplay.prototype, "router", void 0);
KanaloaDisplay = __decorate([
    customElement('kanaloa-display')
], KanaloaDisplay);
export { KanaloaDisplay };
//# sourceMappingURL=kanaloa-display.js.map