import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from 'react-redux'
import App from "./views/layouts/App";
import 'antd/dist/antd.css';
import store, { history } from './store'


ReactDOM.render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>
    , document.getElementById("root"));
