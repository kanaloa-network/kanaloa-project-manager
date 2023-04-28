import { LitElement, html, css } from 'lit';
import { customElement, property } from "lit/decorators.js";
import { Shade, background } from './common-styles';
import { KanaloaOutlet } from './kanaloa-outlet';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { Router } from '@vaadin/router';
import "./wallet-info";

@customElement('kanaloa-display')
export class KanaloaDisplay extends LitElement {

    outlet: Ref<KanaloaOutlet> = createRef();
    @property()
    router: Router | undefined;

    constructor() {
        super();
    }

    static get styles() {
        return [
            css`
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
            background(Shade.DARK)
        ];
    }

    updated() {
        this.router?.setOutlet(this.outlet.value!)
    }

    render() {
        return html`
            <div class="top-bar">
                <kana-wallet-info address="0x0000000000000000000000000"></kana-wallet-info>
            </div>
            <kanaloa-outlet ${ref(this.outlet)}></kanaloa-outlet>
        `;
    }
}