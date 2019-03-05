import React from 'react';
import App from '../views/layouts/App/';
import Home from '../views/layouts/Home';
import Project from '../views/layouts/Project';
import Task from '../views/layouts/Task';
import Login from '../views/layouts/Login';
import isPrivate from './isPrivate'

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
                component: Login,
                exact: true,
            }
        ]
    }
]


export default routes;
