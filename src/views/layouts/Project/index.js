import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import {Tabs, Icon, Empty} from 'antd';
import {getProjectRequest} from "../../../store/ducks/task";

const TabPane = Tabs.TabPane;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId: customerId, projectId: projectId} } }) => {
            const promises = [];
            const { task: {list: list} } = getState();
            projectId = parseInt(projectId);

            const tasks = list.find((project) => project.projectId === projectId)

            if(!tasks) {
                promises.push(dispatch(getProjectRequest(projectId)));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    (state, {match: {params: {projectId: id}}}) => ({
        tma: state.task.list.find((project) => project.projectId === parseInt(id)).tma,
        tasks: state.task.list.find((project) => project.projectId === parseInt(id)).tasks,
        sprints: state.task.list.find((project) => project.projectId === parseInt(id)).sprints
    }),
    dispatch => ({
    }),
)
class Project extends React.Component {


    callback(key) {
        console.log(key);
    }

    render() {
        const { tma, tasks, sprints } = this.props

        return (
            <Tabs tabBarStyle={{display: 'flex', alignItems:'center', justifyContent:'center', flex: 1}} defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab={<Icon type="interation" theme="filled" style={{fontSize: '28px', color: '#3d324c' }} />} key="1">
                    {
                        (tasks.length === 0) && (<Empty description="Il n'y a pas de sprints"/>)
                    }
                </TabPane>
                <TabPane tab={<Icon type="project" theme="filled" style={{ fontSize: '28px', color: '#3d324c' }} />} key="2">
                    {
                        (tasks.length === 0) && (<Empty description="Il n'y a pas de tickets"/>)
                    }
                </TabPane>
                <TabPane tab={<Icon type="hdd" theme="filled" style={{ fontSize: '28px', color: '#3d324c' }} />} key="3">
                    {
                        (tma.length === 0) && (<Empty description="Il n'y a pas de tickets"/>)
                    }
                </TabPane>
            </Tabs>
        );
    }
}

export default Project
