import React from 'react';
import App from '../views/layouts/App/';
import Home from '../views/layouts/Home';
import Project from '../views/layouts/Project';
import Task from '../views/layouts/Task';
import Timer from '../views/layouts/Timer';
import Login from '../views/layouts/Login';

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
                path: '/customer/:customerId/project/:projectId/task/:taskType/:taskId',
                component: Task,
                exact: true,
            },
            {
                path: '/timer',
                component: Timer,
                exact: true,
            },
            {
                path: '/login',
                component: Login,
                exact: true,
            }
        ]
    }
]


export default routes;
