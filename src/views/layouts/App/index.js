import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Header from '../../../components/Header'
export default class App extends Component {

    static propTypes = {
    };

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    render() {
        const { route } = this.props;
        return (
            <div>
                <Header/>
                {renderRoutes(route.routes)}
            </div>
        );
    }
}
