import React, { Component }from 'react';
import PropTypes from 'prop-types';
import { loginRequest } from '../../../store/ducks/user';
import { renderRoutes } from 'react-router-config';
import Header from '../../../components/Header'
import { connect } from 'react-redux';
import { Spin } from 'antd';
import {asyncConnect} from "redux-connect";
import {ipcRenderer} from "electron";

let firstAsyncConnect = false;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];
            const { user } = getState();
            ipcRenderer.send('getToken');
            ipcRenderer.on('getTokenResult', (event, token) => {
                if(!user.isLogged && token && !firstAsyncConnect) {
                    console.log(user)
                    firstAsyncConnect = true;
                    promises.push(dispatch(loginRequest(token)))
                }
                return Promise.all(promises);
            });
        },
    },
])
@connect(
    state => ({
        loaded: state.reduxAsyncConnect.loaded,
    })
)
export default class App extends Component {

    static propTypes = {
    };

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
