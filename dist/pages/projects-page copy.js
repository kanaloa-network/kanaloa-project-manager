var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { KanaCard } from '../components/card';
import '../components/button';
import '../components/card';
import '../components/loader';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { GlobalKanaloaEthers } from '../api/kanaloa-ethers';
import { Contract } from 'ethers';
import { AbstractCardsPage } from './abstract-cards-page';
let ProjectsPage = class ProjectsPage extends AbstractCardsPage {
    constructor() {
        super();
        this.items = [];
        this.isLoading = true;
    }
    async fetchData() {
        this.isLoading = true;
        const projects = await GlobalKanaloaEthers.projectRegistry.getProjects();
        if (GlobalKanaloaEthers.readOnly) {
            this.isLoading = false;
            this.items = [];
        }
        const response = [];
        for (let project of projects) {
            // "project" here is an arraylike containing:
            // 0 - the project address
            // 1 - the deployer, which we dgaf about
            // 2 - the visibility of the project, which is irrelevant here
            // 3 - the description of the project
            const proj = new Contract(project[0], [
                "function balanceOf(address owner) view returns (uint256 balance)",
                "function name() view returns (string)",
                "function symbol() view returns (string)"
            ], GlobalKanaloaEthers.wallet);
            // NOTE/TODO: The most innefficient way to do this
            // Move to a subgraph and a Promise.all in production
            if (await proj.balanceOf(GlobalKanaloaEthers.address) != 0) {
                const address = project[0];
                const name = await proj.name();
                response.push(new KanaCard({
                    name: name,
                    button: {
                        text: "Contracts",
                        link: `/projects/${address}`
                    },
                    address: address,
                    description: project[3]
                }));
            }
        }
        this.isLoading = false;
        this.items = response;
    }
    render() {
        return html `
            <h1>My Projects</h1>
            <div class="project-cards">
                ${when(this.isLoading, () => html `<kana-loading-screen></kana-loading-screen>`, () => repeat(this.items, (k) => k.name, (c) => html `${c}`))}
            </div>
            <a href="new-project">
                <kana-button>Create new project</kana-button>
            </a>
        `;
    }
};
ProjectsPage = __decorate([
    customElement('projects-page')
], ProjectsPage);
export { ProjectsPage };
//# sourceMappingURL=projects-page%20copy.js.map