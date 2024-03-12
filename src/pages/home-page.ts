import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../components/button';
import '../components/loader';
import '../components/ticket';


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
                
                kana-ticket {
                    font-size: 3rem;
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

                div {
                    position: absolute;
                    bottom: 15%;
                }

                h1 {
                    font-size: 5.5rem;
                }
            `
        ]
    }

    render() {
        return html`
            <img class="floating" src="media/img/home-banner.png">
            <div>
                <h1>KANALOA NETWORK</h1>
                <kana-ticket><b>50%</b> OFF!</kana-ticket>
            </div>
        `;
    }
}
