import React from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config';
import { ReduxAsyncConnect } from 'redux-connect';
import store, {history} from './store'
import routes from './routes/routes';

ReactDOM.render(
    <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
            <HashRouter>
                <ReduxAsyncConnect routes={routes} store={store}>
                    {renderRoutes(routes)}
                </ReduxAsyncConnect>
            </HashRouter>
        </ConnectedRouter>
    </ReduxProvider>, document.getElementById("root"));
