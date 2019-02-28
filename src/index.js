import React from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ReduxAsyncConnect } from 'redux-connect';
import store from './store'
import routes from './routes';

ReactDOM.render(
    <ReduxProvider store={store}>
        <HashRouter>
            <ReduxAsyncConnect routes={routes} store={store}>
                {renderRoutes(routes)}
            </ReduxAsyncConnect>
        </HashRouter>
    </ReduxProvider>, document.getElementById("root"));
