import React from 'react';
import App from './views/layouts/App';
import Home from './views/layouts/Home';
import Project from './views/layouts/Project';

const routes = [
    {
        component: App,
        routes: [
            {
                path: '/',
                exact: true,
                component: Home
            },
            {
                path: '/customer/:customerId/project/:projectId',
                component: Project,
                exact: true,
            }
        ]
    }
]


export default routes;
