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

@customElement('projects-page')
export class ProjectsPage extends AbstractCardsPage {
    async fetchData() {
        this.isLoading = true;
        const projects = 
            await GlobalKanaloaEthers.projectRegistry.getProjects();
        
        if (GlobalKanaloaEthers.readOnly) {
            this.isLoading = false;
            this.items = [];
        }

        const response: KanaCard[] = [];
        
        for (let project of projects) {
            // "project" here is an arraylike containing:
            // 0 - the project address
            // 1 - the deployer, which we dgaf about
            // 2 - the visibility of the project, which is irrelevant here
            // 3 - the description of the project
            const proj = new Contract(
                project.address,
                [
                    "function balanceOf(address owner) view returns (uint256 balance)",
                    "function name() view returns (string)",
                    "function symbol() view returns (string)"
                ],
                GlobalKanaloaEthers.wallet
            );

            // NOTE/TODO: The most innefficient way to do this
            // Move to a subgraph and a Promise.all in production
            try {
                if (
                    (
                        await proj.balanceOf(
                            await GlobalKanaloaEthers.requestSigner()
                        )
                    ) != 0
                ) {
                    const address: string = project.address;
                    const name: string = project.project;
                    response.push(new KanaCard({
                        name: name,
                        button: {
                            text: "Contracts",
                            link: `/projects/${address}`
                        },
                        address: address,
                        description: project.description
                    }))
                }
            } catch (err) {}
        }

        this.isLoading = false;
        this.items = response;
    }
      
    render() {
        return html`
            <h1>My Projects</h1>
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
                <kana-button>Create new project</kana-button>
            </a>
        `;
    }
}
