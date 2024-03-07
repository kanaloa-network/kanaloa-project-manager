import { BaseRoute, ComponentResult, Route } from '@vaadin/router';
//import './pages/home-page';
import './pages/profile-page';
import './pages/projects-page';
import './pages/new-project-page';
import './pages/contracts-page';
import './pages/contract-page';
import './pages/home-page';
import { KanaloaAPI } from './api/kanaloa-ethers';
import { Contract, ethers } from 'ethers';
import { ContractsPage } from './pages/contracts-page';
import { ContractPage } from './pages/contract-page';
import { BASIC_MODULES } from './components/modules/modules-list';
import { ModuleParams } from './components/modules/commons';
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
  { 
    path: "/profile",
    component: "profile-page",
    name: "Profile"
  },
  { 
    path: "/PROJECT_ID_OR_SIMILAR",
    component: "edit-project-page",
    name: "Edit Project"
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
          KanaloaAPI.wallet
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
    component: "contract-page",
    action: 
      async (ctx, cmd) => {
        const proj = new Contract(
          ctx.params.address as string,
          [
              "function name() view returns (string)",
          ],
          KanaloaAPI.wallet
        );

        const projectName: string = await proj.name();
        const contractPage = 
          (cmd.component("contract-page") as unknown as ContractPage);
        contractPage.projectName = `${projectName}`;
        contractPage.projectAddress = ctx.params.address as string;
        contractPage.expandedMode = false;
        return contractPage;
      }
  },
  {
    path: "/projects/:address/:contract",
    component: "contract-page",
    action: 
      async (ctx, cmd) => {
        const proj = new Contract(
          ctx.params.address as string,
          [
              "function name() view returns (string)",
          ],
          KanaloaAPI.wallet
        );

        const contract = new Contract(
          ctx.params.contract as string,
          [
              "function name() view returns (string)",
              "function getActiveModule(bytes32 signature) view returns (address)"
          ],
          KanaloaAPI.wallet
        );

        let baseModule: ModuleParams;
        for (const base of BASIC_MODULES) {
          const module: string = await contract.getActiveModule(base.signature);
          if (module != ethers.ZeroAddress) {
            baseModule = base;
            break;
          }
        }

        const projectName: string = await proj.name();
        const contractPage = 
          (cmd.component("contract-page") as unknown as ContractPage);
        contractPage.selectedBaseModule = baseModule!; 
        contractPage.projectName = `${projectName}`;
        contractPage.projectAddress = ctx.params.address as string;
        contractPage.contract = ctx.params.contract as string;
        contractPage.contractName = await contract.name();
        contractPage.expandedMode = true;

        return contractPage;
      }
  },
  // { path: '/team', component: 'team-page' },
  // { path: '/about', component: 'about-page' },
  // { path: '(.*)', component: 'not-found-page' },
];