import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../components/button';
import '../components/loader';


@customElement('home-page')
export class HomePage extends LitElement {

    @property({ type: String })
    declare name: String;
    
    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    font-family: Ablation;
                    font-weight: 900;
                }

                .floating {  
                    animation-name: floating;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                    margin-left: 30px;
                    margin-top: 5px;
                }
                
                @keyframes floating {
                    from { transform: translate(0,  0px); }
                    65%  { transform: translate(0, 15px); }
                    to   { transform: translate(0, -0px); }    
                }

                h1 {
                    position: absolute;
                    font-size: 5.5rem;
                    bottom: 15%;
                }
            `
        ]
    }

    render() {
        return html`
            <img class="floating" src="media/img/home-banner.png">
            <h1>KANALOA NETWORK</h1>
        `;
    }
}
