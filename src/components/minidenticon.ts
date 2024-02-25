import { minidenticon as identicon } from "minidenticons";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('identicon-img')
export class Minidenticon extends LitElement {
    @property({ type: String })
    declare hash: string;
    
    static get styles() {
        return css`
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
        return html`
            <img src="${genSvgDataSrc(this.hash)}"/>
        `
    }
}

export function genSvgDataSrc(hash: string): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(identicon(hash || ""))}`;
}