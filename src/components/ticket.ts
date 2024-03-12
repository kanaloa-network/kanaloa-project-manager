import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement("kana-ticket")
export class KanaTicket extends LitElement {

  static get styles() {
    return css`
        /* Original CSS by Tomas Pustelnik */
        /* https://codepen.io/Pustelto/pen/YwBZwK */
          :host {
            position: absolute;
            box-sizing: border-box;
            width: 220px;
            height: 500px;
            padding: 20px;
            border-radius: 10px;
            background: var(--highlighted-color);
            box-shadow: 2px 2px 15px 0px #AB9B0D;
            transform: scale(30%) rotate(-100deg);
            top: -45%;
            right: -5.5rem;
          }
          :host:before, :host:after {
            content: "";
            position: absolute;
            left: 5px;
            height: 6px;
            width: 210px;
          }
          :host:before {
            top: -5px;
            background: radial-gradient(
                circle, 
                transparent, 
                transparent 50%, 
                var(--highlighted-color) 50%, 
                var(--highlighted-color) 100%) 
                -7px -8px/16px 16px 
                repeat-x;
          }
          :host:after {
            bottom: -5px;
            background: radial-gradient(
                circle, 
                transparent, 
                transparent 50%, 
                var(--highlighted-color) 50%, 
                var(--highlighted-color) 100%) 
                -7px -2px/16px 16px 
                repeat-x;
          }
          
          div {
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            border: 6px solid #D8D8D8;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          p {
            width: max-content;
            white-space: nowrap;
            font-family: "Helvetica", "Arial", sans-serif;
            font-size: 5.5rem;
            font-weight: 900;
            text-transform: uppercase;
            color: #C6DEDE;
            transform: rotate(90deg);
          }
    `;
  }

  render() {
    return html`
      <div><p><slot></slot></p></div>
    `;
  }
}