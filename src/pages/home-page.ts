import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../components/button';
import '../components/card';
import '../components/loader';
import '../components/forms/pulpito/pulpito-form';
import '../components/forms/pulpito/pulpito-input';


@customElement('home-page')
export class HomePage extends LitElement {

    @property({ type: String })
    declare name: String;
      
    render() {
        return html`
            <h1>${this.name}</h1>
        `;
    }
}
