import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import {Tabs, Icon, Empty, Select} from 'antd';
import { getCustomerRequest } from "../../../store/ducks/customer";
import { getProjectRequest } from "../../../store/ducks/task";
import TaskList from '../../../components/TaskList'
import UserStory from '../../../components/UserStory'

const Option = Select.Option;
const TabPane = Tabs.TabPane;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId: customerId, projectId: projectId} } }) => {
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
    (state, {match: {params: {customerId: customerId, projectId: id}}}) => ({
        customer: state.customer.list.find((customer) => customer.id === parseInt(customerId)),
        tma: state.task.list.find((project) => project.projectId === parseInt(id)).tma,
        tasks: state.task.list.find((project) => project.projectId === parseInt(id)).tasks,
        sprints: state.task.list.find((project) => project.projectId === parseInt(id)).sprints
    }),
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
        const { tma, tasks, sprints, customer } = this.props
        const { selectedSprint } = this.state

        return (
            <div className="overflow-y-scroll">
            <p className="flex flex-auto items-center justify-center ma0 fw4 f4 lh-copy">
                { customer.name }
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
                            <TaskList tasks={tasks} />
                    }
                </TabPane>
                <TabPane tab={<Icon type="hdd" theme="filled" style={{ fontSize: '28px', color: '#3d324c' }} />} key="3">
                    {
                        (tasks.length === 0) ?
                            (<Empty description="Il n'y a pas de tickets"/>)
                            :
                            <TaskList tasks={tma} />
                    }
                </TabPane>
            </Tabs>
            </div>
        );
    }
}

export default Project
