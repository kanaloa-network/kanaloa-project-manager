import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KanaCard } from '../components/card';
import '../components/button';
import '../components/card';
import '../components/loader';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { Contract } from 'ethers';
import { AbstractCardsPage } from './abstract-cards-page';


@customElement('contracts-page')
export class ContractsPage extends AbstractCardsPage {

    @property({ type: String })
    declare name: String;
    @property({ type: String })
    declare address: string;

    async fetchData() {
        this.isLoading = true;
        const response: KanaCard[] = [];

        const project = new Contract(
            this.address,
            [
                "function balanceOf(address owner) view returns (uint256 balance)",
                "function name() view returns (string)",
                "function symbol() view returns (string)"
            ],
            GlobalKanaloaEthers.wallet
        );

            // // NOTE/TODO: The most innefficient way to do this
            // // Move to a subgraph and a Promise.all in production
            // if (await proj.balanceOf(GlobalKanaloaEthers.address) != 0) {
            //     const address: string = project[0];
            //     const name: string = await proj.name();
            //     response.push(new KanaCard({
            //         name: name,
            //         button: {
            //             text: "Contracts",
            //             link: `/projects/${address}`
            //         },
            //         address: address,
            //         description: project[3]
            //     }))
            // }
            //}

        this.isLoading = false;
        this.items = response;
    }
      
    render() {
        return html`
            <h1>${this.name}</h1>
            <div class="cards">
                ${
                    when(
                        this.isLoading,
                        () => html`<kana-loading-screen></kana-loading-screen>`,
                        () => repeat(
                                this.items, 
                                (k) => k.name, 
                                (c) => html`${c}`
                            )
                    )
                }
            </div>
            <a href="new-project">
                <kana-button>Create new contract</kana-button>
            </a>
        `;
    }
}