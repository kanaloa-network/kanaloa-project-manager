//import './pages/home-page';
import './pages/projects-page';
import './pages/new-project-page';
export const navRoutes = [
    {
        path: "/projects",
        component: "projects-page",
        name: "My projects",
        icon: "backup_table"
    },
    {
        path: "/new-project",
        component: "new-project-page",
        name: "New project",
        icon: "add_box"
    }
];
const routes = [
    {
        path: '/',
        component: "home-page",
        name: "HOME"
    },
    ...navRoutes,
    // { path: '/team', component: 'team-page' },
    // { path: '/about', component: 'about-page' },
    // { path: '(.*)', component: 'not-found-page' },
];
export default routes;
//# sourceMappingURL=routes.js.map