import React, { Component } from 'react';
import { connect } from 'react-redux';

const withUser = WrappedComponent => {
    class WithUserComponent extends Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return connect(state => ({
        user: state.user,
    }))(WithUserComponent);
};

export default withUser;
