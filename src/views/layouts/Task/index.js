import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import {getProjectRequest, getCustomersRequest} from "../../../store/ducks/planck";

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId, projectId, taskType, taskId} } }) => {
            const promises = [];
            customerId = parseInt(customerId);
            projectId = parseInt(projectId);

            const {planck: {entities: {customers, projects}}} = getState();

            // Check if we have already the customer and the project
            if (!customers[customerId]) {
                promises.push(dispatch(getCustomersRequest()));
            }

            // Check if we have the project
            if (projects[projectId]) {

                // Check if we have already the tasks/sprints/supportTasks of the project
                if(!projects[projectId].tasks && !projects[projectId].sprints && !projects[projectId].supportTasks) {
                    promises.push(dispatch(getProjectRequest(projectId)));
                }
            } else {
                // We don't have the project
                promises.push(dispatch(getProjectRequest(projectId)));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    (state, {match: {params: {customerId, projectId, taskType, taskId}}}) => {
        return ({
            task: state.planck.entities[taskType][taskId],
        })
    },
    dispatch => ({
    }),
)
class Task extends React.Component {


    render() {
        const { task } = this.props;
        console.log(task)
        return (
            <div>
                Hello task
            </div>
        );
    }
}

export default Task
