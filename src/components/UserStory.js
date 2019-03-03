import React from "react";
import PropTypes from "prop-types";
import { Empty, Collapse } from 'antd';
import TaskList from './TaskList'
import Tag from "./Tag";
import { connect } from 'react-redux';

const Panel = Collapse.Panel;

const order = ['todo', 'wip', 'done'];

@connect(
    (state) =>
    ({
        usTasks: state.planck.entities.usTasks,
    }),
    dispatch => ({
    }),
)
class UserStory extends React.Component {

    static propTypes = {
        userStories: PropTypes.array.isRequired,
        usTasks: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

    }

    render() {
        let {userStories, usTasks} = this.props

        userStories = userStories.sort(function (a, b) {
            return order.indexOf(a.status) - order.indexOf(b.status);
        });

        return (
            <div>
                {
                userStories.length === 0 ?
                    (<Empty description="Il n'y a pas d'User Story"/>)
                    :
                    <div className={"flex flex-auto flex-column w-100 h-100 mt3"}>
                        <Collapse accordion>
                            {
                                userStories.map((userStorie) =>
                                    <Panel
                                    key={userStorie.id}
                                    header={
                                        <div className={'flex flex-auto items-center justify-between'}>
                                            {`US: ${userStorie.title}`}
                                            <span>{<Tag type="status" tag={userStorie.status}/>}</span>
                                        </div>
                                    }
                                    >
                                    {
                                        (userStorie.tasks.length === 0) ?
                                            (<Empty description="Il n'y a pas de tickets"/>)
                                        :
                                            <TaskList taskType="usTasks" tasks={userStorie.tasks.map((id) => usTasks[id])}/>
                                    }
                                    </Panel>
                                )}
                        </Collapse>
                    </div>
                }
            </div>
        );
    }
};

export default UserStory;
