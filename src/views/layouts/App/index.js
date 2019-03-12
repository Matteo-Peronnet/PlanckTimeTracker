import React, { Component }from 'react';
import PropTypes from 'prop-types';
import { loginRequest } from '../../../store/ducks/user';
import { restoreTimerRequest } from '../../../store/ducks/timer';
import { renderRoutes } from 'react-router-config';
import Header from '../../../components/Header'
import { connect } from 'react-redux';
import { Spin } from 'antd';
import {asyncConnect} from "redux-connect";
import {ipcRenderer} from "electron";
import withUser from "../../../routes/withUser";
import {storage} from "../../../i18n";

let firstAsyncConnect = false;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];
            const { user, router: {location: {pathname}} } = getState();
            ipcRenderer.send('getToken');
            ipcRenderer.on('getTokenResult', (event, token) => {
                if(!user.isLogged && token && !firstAsyncConnect) {
                    firstAsyncConnect = true;
                    promises.push(dispatch(loginRequest(token)))
                }
            });
            return Promise.all(promises).then(() => {
                // Check if we have a timer that has been started previously and we are connected
                if (pathname !== '/login' && storage.has('timer')) {
                    dispatch(restoreTimerRequest(storage.get('timer')))
                }
            });
        },
    },
])
@connect(
    state => ({
        loaded: state.reduxAsyncConnect.loaded,
    })
)
@withUser
export default class App extends Component {

    render() {
        const { route, loaded } = this.props;
        return (
            <div className="vh-100 flex flex-column flex-auto">
            <Header/>
            {
            loaded ?
                renderRoutes(route.routes)
                :
                <div className="flex flex-auto justify-center items-center">
                    <Spin size="large" />
                </div>
            }
            </div>
        );
    }
}
