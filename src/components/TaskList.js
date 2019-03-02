import React from "react";
import { Collapse, Table, Divider } from 'antd';
import PropTypes from 'prop-types';
import Tag from './Tag'
const Panel = Collapse.Panel;

function callback(key) {
    console.log(key);
}

const columns = [{
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: tag => (
        <span>
            <Tag tag={tag}/>
        </span>
    ),
}];

export const TaskList = (props) => {

    const { tasks } = props;

    const todo = tasks.filter((task) => task.status === 'todo');
    const wip = tasks.filter((task) => task.status === 'wip');
    const pr = tasks.filter((task) => task.status === 'pr');
    const done = tasks.filter((task) => task.status === 'done');

    return (
        <Collapse bordered={false} onChange={callback}>
            <Panel header="TODO" key="1" disabled={todo.length === 0}>
                <Table
                    columns={columns}
                    dataSource={todo}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="WIP" key="2" disabled={wip.length === 0}>
                <Table
                    columns={columns}
                    dataSource={wip}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="PR" key="3" disabled={pr.length === 0}>
                <Table
                    columns={columns}
                    dataSource={pr}
                    bordered={false}
                    showHeader={false}
                    pagination={false}
                />
            </Panel>
            <Panel header="DONE" key="4" disabled={done.length === 0}>
                <Table
                    columns={columns}
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
};

export default TaskList;
