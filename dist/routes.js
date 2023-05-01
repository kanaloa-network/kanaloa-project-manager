//import './pages/home-page';
import './pages/projects-page';
import './pages/new-project-page';
import './pages/contracts-page';
import { GlobalKanaloaEthers } from './api/kanaloa-ethers';
import { Contract } from 'ethers';
export const navRoutes = [
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
export const routes = [
    {
        path: '/',
        component: "home-page",
        name: "HOME"
    },
    ...navRoutes,
    {
        path: "/projects/:address",
        component: "contracts-page",
        action: async (ctx, cmd) => {
            const proj = new Contract(ctx.params.address, [
                "function name() view returns (string)",
            ], GlobalKanaloaEthers.wallet);
            const projectName = await proj.name();
            const contractsPage = cmd.component("contracts-page");
            contractsPage.name = projectName;
            contractsPage.address = ctx.params.address;
            return contractsPage;
        }
    }
    // { path: '/team', component: 'team-page' },
    // { path: '/about', component: 'about-page' },
    // { path: '(.*)', component: 'not-found-page' },
];
//# sourceMappingURL=routes.js.map