import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Header from '../../../components/Header'
import { connect } from 'react-redux';
import { Spin } from 'antd';

@connect(
    state => ({
        loaded: state.reduxAsyncConnect.loaded,
    })
)
export default class App extends Component {

    static propTypes = {
    };

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

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
