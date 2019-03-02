import React from "react";
import { withRouter } from "react-router";
import { Collapse, Table, Avatar } from 'antd';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Tag from './Tag'
const Panel = Collapse.Panel;

const columns = (customerId, projectId, taskType) => ([
    {
        title: 'Asigned',
        dataIndex: 'assignedTo',
        key: 'asigned',
        render:
            asigned => asigned ?
                <Avatar
                    shape="square"
                    size="large"
                    icon="user"
                    src={`https://planck.troopers.agency/user/${asigned.id}/avatar`}
                />
                    :
                <Avatar shape="square" size="large" icon="user" />,
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render:
            (text, record) =>
            {
                return <Link
                    to={`/customer/${customerId}/project/${projectId}/task/${taskType}/${record.id}`}
                    style={{ cursor: "pointer" }}
                >
                    {`#${record.uid.uid} ${text}`}
                </Link>
            }
        },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: tag => (
            <span>
                <Tag tag={tag}/>
            </span>
        ),
    }
]);

export const TaskList = (props) => {

    const { tasks, taskType, match: {params: {customerId, projectId}} } = props;

    const todo = tasks.filter((task) => task.status === 'todo');
    const wip = tasks.filter((task) => task.status === 'wip');
    const pr = tasks.filter((task) => task.status === 'pr');
    const done = tasks.filter((task) => task.status === 'done');

    return (
        <Collapse bordered={false}>
            <Panel header="TODO" key="1" disabled={todo.length === 0}>
                <Table
                    columns={columns(customerId, projectId, taskType)}
                    dataSource={todo}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="WIP" key="2" disabled={wip.length === 0}>
                <Table
                    columns={columns(customerId, projectId, taskType)}
                    dataSource={wip}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="PR" key="3" disabled={pr.length === 0}>
                <Table
                    columns={columns(customerId, projectId, taskType)}
                    dataSource={pr}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="DONE" key="4" disabled={done.length === 0}>
                <Table
                    columns={columns(customerId, projectId, taskType)}
                    dataSource={done}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
        </Collapse>
    );
};

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired,
    taskType: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(TaskList);
