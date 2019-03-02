import React from 'react';
import App from './views/layouts/App';
import Home from './views/layouts/Home';
import Project from './views/layouts/Project';
import Task from './views/layouts/Task';

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
            },
            {
                path: '/customer/:customerId/project/:projectId/task/:taskId',
                component: Task,
                exact: true,
            }
        ]
    }
]


export default routes;
