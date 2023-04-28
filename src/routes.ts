import { BaseRoute, Route } from '@vaadin/router';
//import './pages/home-page';
import './pages/projects-page';
import './pages/new-project-page';
// import './pages/not-found-page';

interface RouteExtended extends BaseRoute {
  icon: String;
}

export const navRoutes: RouteExtended[] = [
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

const routes: Route[] = [
  { 
    path: '/', 
    component: "home-page", 
    name: "HOME" 
  },
  ...(navRoutes as Route[]),
  // { path: '/team', component: 'team-page' },
  // { path: '/about', component: 'about-page' },
  // { path: '(.*)', component: 'not-found-page' },
];

export default routes;