import React from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';
import { Provider as ReduxProvider } from 'react-redux';
import ConnectedIntl from './views/providers/ConnectedIntl'
import { HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config';
import { ReduxAsyncConnect } from 'redux-connect';
import env from '../env.json'
import * as Sentry from '@sentry/browser';
import isDev from 'electron-is-dev';
import store, {history} from './store'
import routes from './routes/routes';
import events from './events';

if (!isDev) {
    Sentry.init({
        dsn: env.SENTRY_DSN,
    });
}

events()

ReactDOM.render(
    <ReduxProvider store={store}>
        <ConnectedIntl>
            <ConnectedRouter history={history}>
                <HashRouter>
                    <ReduxAsyncConnect routes={routes} store={store}>
                        {renderRoutes(routes)}
                    </ReduxAsyncConnect>
                </HashRouter>
            </ConnectedRouter>
        </ConnectedIntl>
    </ReduxProvider>, document.getElementById("root"));
