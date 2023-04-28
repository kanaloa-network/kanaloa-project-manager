var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { identicon } from "minidenticons";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
let Minidenticon = class Minidenticon extends LitElement {
    hash = 'ayy';
    static get styles() {
        return css `
            img {
                width: auto;
                height: 100%;
            }
        `;
    }
    constructor() {
        super();
    }
    render() {
        return html `
            <img src="${genSvgDataSrc(this.hash)}"/>
        `;
    }
};
__decorate([
    property({ type: String })
], Minidenticon.prototype, "hash", void 0);
Minidenticon = __decorate([
    customElement('identicon-img')
], Minidenticon);
export { Minidenticon };
export function genSvgDataSrc(hash) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(identicon(hash))}`;
}
//# sourceMappingURL=minidenticon.js.map