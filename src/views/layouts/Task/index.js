import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import {getProjectRequest} from "../../../store/ducks/task";
import {getCustomerRequest} from "../../../store/ducks/customer";

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId, projectId} } }) => {
            const promises = [];
            customerId = parseInt(customerId);
            projectId = parseInt(projectId);

            const { task: {list: taskList}, customer: {list: customerList} } = getState();

            const tasks = taskList.find((project) => project.projectId === projectId)
            const customer = customerList.find((customer) => customer.id === customerId)

            /**
             * @Todo
             * Improve search, actually we check if we have all tasks.
             * We just need current task
             */
            if(!tasks) {
                promises.push(dispatch(getProjectRequest(projectId)));
            }

            if (!customer) {
                promises.push(dispatch(getCustomerRequest(customerId)));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    (state, {match: {params: {customerId, projectId, taskType, taskId}}}) => {

    },
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
