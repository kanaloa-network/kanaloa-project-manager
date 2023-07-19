import { BaseRoute, ComponentResult, Route } from '@vaadin/router';
//import './pages/home-page';
import './pages/projects-page';
import './pages/new-project-page';
import './pages/contracts-page';
import './pages/new-contract-page';
import { GlobalKanaloaEthers } from './api/kanaloa-ethers';
import { Contract } from 'ethers';
import { ContractsPage } from './pages/contracts-page';
import { NewContractPage } from './pages/new-contract-page';
// import './pages/not-found-page';

interface RouteExtended extends BaseRoute {
  icon: String;
}

export const navRoutes: RouteExtended[] = [
  { 
    path: "/projects", 
    component: "projects-page", 
    name: "My projects",
    icon: "backup_table",
    // children: [

    // ]
  },
  { 
    path: "/new-project", 
    component: "new-project-page", 
    name: "New project",
    icon: "add_box"
  }
  
];

export const routes: Route[] = [
  { 
    path: '/', 
    component: "home-page", 
    name: "HOME" 
  },
  ...(navRoutes as Route[]),
  {
    path: "/projects/:address",
    component: "contracts-page",
    action: 
      async (ctx, cmd) => {
        const proj = new Contract(
          ctx.params.address as string,
          [
              "function name() view returns (string)",
          ],
          GlobalKanaloaEthers.wallet
        );

        const projectName: string = await proj.name();
        const contractsPage = 
          (cmd.component("contracts-page") as unknown as ContractsPage);
        contractsPage.name = projectName;
        contractsPage.address = ctx.params.address as string;
        return contractsPage;
      }
  },
  {
    path: "/projects/:address/new-contract",
    component: "new-contract-page",
    action: 
      async (ctx, cmd) => {
        const proj = new Contract(
          ctx.params.address as string,
          [
              "function name() view returns (string)",
          ],
          GlobalKanaloaEthers.wallet
        );

        const projectName: string = await proj.name();
        const contractsPage = 
          (cmd.component("new-contract-page") as unknown as NewContractPage);
        contractsPage.name = `${projectName}`;
        contractsPage.address = ctx.params.address as string;
        return contractsPage;
      }
  }
  // { path: '/team', component: 'team-page' },
  // { path: '/about', component: 'about-page' },
  // { path: '(.*)', component: 'not-found-page' },
];