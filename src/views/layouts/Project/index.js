import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import {Tabs, Icon, Empty, Select} from 'antd';
import { getCustomersRequest, getProjectRequest} from "../../../store/ducks/planck";
import TaskList from '../../../components/TaskList'
import UserStory from '../../../components/UserStory'
import {Ov} from "../../../utils";
import isPrivate from "../../../routes/isPrivate";
import { injectIntl, FormattedMessage } from 'react-intl'

const Option = Select.Option;
const TabPane = Tabs.TabPane;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId, projectId} } }) => {
            const promises = [];
            customerId = parseInt(customerId);
            projectId = parseInt(projectId);

            const {planck: {entities: {customers, projects}}} = getState();

            // Check if we already have the customer
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
    (state, {match: {params: {customerId, projectId}}}) => {
        const project = state.planck.entities.projects[projectId];
        return ({
            project,
            customer: state.planck.entities.customers[customerId],
            sprints: project.sprints.map((id) => state.planck.entities.sprints[id]),
            userStories: state.planck.entities.userStories,
            tasks: project.tasks.map((id) => state.planck.entities.tasks[id]),
            supportTasks: project.supportTasks.map((id) => state.planck.entities.supportTasks[id]),
        })
    },
    dispatch => ({
    }),
)
@isPrivate
@injectIntl
class Project extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            sprintUserStories: null
        }
    }

    handleChange(value) {
        this.setState({
            sprintUserStories: this.props.sprints
                .find((sprint) => sprint.id === value).userStories
                .map((id) => this.props.userStories[id])
        })
    }

    render() {
        const { supportTasks, tasks, sprints, customer, project } = this.props
        const { sprintUserStories } = this.state
        return (

            <div className="overflow-y-scroll">
            <p className="flex flex-auto items-center justify-center ma0 fw4 f4 lh-copy bb b--black-05" style={{backgroundColor: 'rgb(61, 50, 76)', color: 'white'}}>
                { customer.name } { customer.projects.length > 1 && (` - ${project.name}`) }
            </p>
            <Tabs tabBarStyle={{display: 'flex', alignItems:'center', justifyContent:'center', flex: 1}} defaultActiveKey="1">
                <TabPane tab={<p className="f5"><FormattedMessage id="pages.project.tabs.sprints" /></p>} key="1">
                    {
                        (sprints.length === 0) ?
                            (<Empty description={<FormattedMessage id="pages.project.sprints.empty" />}/>)
                            :
                        <div className="flex flex-auto items-center justify-center flex-column">
                            <Select placeholder={<FormattedMessage id="pages.project.sprints.select" />} style={{width: 220}} onChange={this.handleChange}>
                                {
                                    sprints.map((sprint) => <Option key={sprint.id} value={sprint.id}>{sprint.name}</Option>)
                                }
                            </Select>
                            {
                                sprintUserStories && (
                                    <UserStory userStories={sprintUserStories}/>
                                )
                            }
                        </div>
                    }
                </TabPane>
                <TabPane tab={<p className="f5"><FormattedMessage id="pages.project.tabs.kanban" /></p>} key="2">
                    {
                        (tasks.length === 0) ?
                            (<Empty description={<FormattedMessage id="pages.project.tickets.empty" />} />)
                            :
                            <TaskList taskType="tasks" tasks={tasks} />
                    }
                </TabPane>
                <TabPane tab={<p className="f5"><FormattedMessage id="pages.project.tabs.tma" /></p>} key="3">
                    {
                        (tasks.length === 0) ?
                            (<Empty description={<FormattedMessage id="pages.project.tickets.empty" />} />)
                            :
                            <TaskList taskType="supportTasks" tasks={supportTasks} />
                    }
                </TabPane>
            </Tabs>
            </div>
        );
    }
}

export default Project
