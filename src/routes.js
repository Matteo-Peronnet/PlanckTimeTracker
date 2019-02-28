import React from 'react';
import App from './views/layouts/App';
import Home from './views/layouts/Home';

const routes = [
    {
        component: App,
        routes: [
            { path: '/', exact: true, component: Home },
        ]
    }
]


export default routes;
