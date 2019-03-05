import React from 'react';
import isPrivate from './isPrivate'
import App from '../views/layouts/App/index';
import Home from '../views/layouts/Home/index';
import Project from '../views/layouts/Project/index';
import Task from '../views/layouts/Task/index';
import Login from '../views/layouts/Login/index';

const routes = [
    {
        component: App,
        routes: [
            {
                path: '/',
                exact: true,
                component: isPrivate(Home)
            },
            {
                path: '/customer/:customerId/project/:projectId',
                component: isPrivate(Project),
                exact: true,
            },
            {
                path: '/customer/:customerId/project/:projectId/task/:taskType/:taskId',
                component: isPrivate(Task),
                exact: true,
            },
            {
                path: '/login',
                name: 'Login',
                component: Login,
                exact: true,
            },

        ]
    }
]


export default routes;
