import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KanaCard } from '../components/card';
import '../components/button';
import '../components/card';
import '../components/loader';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { AddressLike, Contract } from 'ethers';
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
                "function symbol() view returns (string)",                
                "function contractsRepositoryLength() view returns (uint256)",
                "function getContracts(uint256 from, uint256 to) view returns (address[])"
            ],
            GlobalKanaloaEthers.wallet
        );

        const contractAbi: string[] = [
            "function name() view returns (string)",
        ]

        // NOTE/TODO: The most innefficient way to do this
        // Move to a subgraph and a Promise.all in production
        let length: number = await project.contractsRepositoryLength();
        if (length != 0) {
            let contracts: AddressLike[] = await project.getContracts(0, length);
            for (let address of contracts) {
                // NOTE: "name()" should be defined as a Standard "Nameable" interface
                // Consider writing a contract metadata repo module too 
                const contract: Contract = new Contract(
                    address as string,
                    contractAbi,
                    GlobalKanaloaEthers.wallet
                );

                const name: string = await contract.name();
                response.push(new KanaCard({
                    name: name,
                    button: {
                        text: "Edit (coming soon)",
                        link: `/contracts/${address}`
                    },
                    address: address as string,
                    description: "" // this should be the list of modules
                }));
            }
            
        }

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
            <a href="${this.address}/new-contract">
                <kana-button>Create new contract</kana-button>
            </a>
        `;
    }
}
