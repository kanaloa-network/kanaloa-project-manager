var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
let KanaloaWindowlet = class KanaloaWindowlet extends LitElement {
    static get styles() {
        return [
            css `
                :host {
                    background-color: var(--foreground-color);
                    color: var(--background-color);
                    border-radius: 1rem;
                    padding: 1rem;
                    width: 60%;
                    max-width: 30rem;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
            `
        ];
    }
    render() {
        return html `
            <slot></slot>
        `;
    }
};
KanaloaWindowlet = __decorate([
    customElement("kana-windowlet")
], KanaloaWindowlet);
export { KanaloaWindowlet };
//# sourceMappingURL=windowlet.js.map