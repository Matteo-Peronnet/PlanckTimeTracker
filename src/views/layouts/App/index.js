import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

export default class App extends Component {
    static propTypes = {
    };

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    render() {
        const { route } = this.props;
        return (
            <div>
                <h1>HEADER</h1>
                {renderRoutes(route.routes)}
            </div>
        );
    }
}
