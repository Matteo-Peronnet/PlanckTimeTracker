import React, { Component } from 'react';
import { connect } from 'react-redux';

const withLogin = WrappedComponent => {
    class WithLoginComponent extends Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return connect(state => ({
        isLogged: false,
    }))(WithLoginComponent);
};

export default withLogin;
