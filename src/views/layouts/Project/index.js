import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import {Tabs, Icon, Empty, Select} from 'antd';
import { getCustomerRequest } from "../../../store/ducks/customer";
import { getProjectRequest } from "../../../store/ducks/task";
import { getCustomerById } from "../../../store/selectors/customer";
import { getProjectById, getProjectName } from "../../../store/selectors/project";
import TaskList from '../../../components/TaskList'
import UserStory from '../../../components/UserStory'

const Option = Select.Option;
const TabPane = Tabs.TabPane;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId, projectId} } }) => {
            const promises = [];
            customerId = parseInt(customerId);
            projectId = parseInt(projectId);

            const { task: {list: taskList}, customer: {list: customerList} } = getState();

            const tasks = taskList.find((project) => project.projectId === projectId)
            const customer = customerList.find((customer) => customer.id === customerId)

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
    (state, {match: {params: {customerId, projectId}}}) => {
        const customer = getCustomerById(state, customerId);
        const project = getProjectById(state, projectId);
        return ({
            customer,
            projectName: getProjectName(customer, projectId),
            tma: project.tma,
            tasks: project.tasks,
            sprints: project.sprints
        })
    },
    dispatch => ({
    }),
)
class Project extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            selectedSprint: null
        }
    }

    handleChange(value) {
        this.setState({
            selectedSprint: this.props.sprints.find((sprint) => sprint.id === value)
        })
    }

    render() {
        const { tma, tasks, sprints, customer, projectName } = this.props
        const { selectedSprint } = this.state

        return (
            <div className="overflow-y-scroll">
            <p className="flex flex-auto items-center justify-center ma0 fw4 f4 lh-copy bb b--black-05" style={{backgroundColor: '#f2f4f5'}}>
                { customer.name } { customer.projects.length > 1 && (` - ${projectName}`) }
            </p>
            <Tabs tabBarStyle={{display: 'flex', alignItems:'center', justifyContent:'center', flex: 1}} defaultActiveKey="1">
                <TabPane tab={<Icon type="interation" theme="filled" style={{fontSize: '28px', color: '#3d324c' }} />} key="1">
                    {
                        (sprints.length === 0) ?
                            (<Empty description="Il n'y a pas de sprints"/>)
                            :
                        <div className="flex flex-auto items-center justify-center flex-column">
                            <Select placeholder="Séléctionner un sprint" style={{width: 220}} onChange={this.handleChange}>
                                {
                                    sprints.map((sprint) => <Option key={sprint.id} value={sprint.id}>{sprint.name}</Option>)
                                }
                            </Select>
                            {
                                selectedSprint && (
                                    <UserStory userStories={selectedSprint.userStories}/>
                                )
                            }
                        </div>
                    }
                </TabPane>
                <TabPane tab={<Icon type="project" theme="filled" style={{ fontSize: '28px', color: '#3d324c' }} />} key="2">
                    {
                        (tasks.length === 0) ?
                            (<Empty description="Il n'y a pas de tickets"/>)
                            :
                            <TaskList taskType="tasks" tasks={tasks} />
                    }
                </TabPane>
                <TabPane tab={<Icon type="hdd" theme="filled" style={{ fontSize: '28px', color: '#3d324c' }} />} key="3">
                    {
                        (tasks.length === 0) ?
                            (<Empty description="Il n'y a pas de tickets"/>)
                            :
                            <TaskList taskType="tma" tasks={tma} />
                    }
                </TabPane>
            </Tabs>
            </div>
        );
    }
}

export default Project
