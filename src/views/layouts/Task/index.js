import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];

            return Promise.all(promises);
        },
    },
])
@connect(
    state => ({
    }),
    dispatch => ({
    }),
)
class Task extends React.Component {


    render() {
        const { } = this.props;

        return (
            <div>
                Hello task
            </div>
        );
    }
}

export default Task
