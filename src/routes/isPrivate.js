import React, { Component } from 'react';
import { connect } from 'react-redux';
import { branch, compose, renderComponent } from 'recompose';
import Login from '../views/layouts/Login'
import { push } from 'connected-react-router'
const isPrivate = WrappedComponent => {
    class WithLoginComponent extends Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
    return compose(
        connect((state, props) => ({
            isLogged: state.user.isLogged,
        })),
        branch( props => {
                if(!props.isLogged){
                    props.dispatch(push('/login'))
                }
                return props.isLogged
            },
            renderComponent(WrappedComponent),
            renderComponent(Login),
        )
    )(WithLoginComponent)
};

export default isPrivate;
