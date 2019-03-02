import React from "react";
import PropTypes from "prop-types";
import { Empty, Collapse } from 'antd';
import TaskList from './TaskList'
import Tag from "./Tag";

const Panel = Collapse.Panel;

const order = ['todo', 'wip', 'done'];

export const UserStory = (props) => {

    let { userStories } = props

    userStories = userStories.sort(function(a, b){
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
                                <span>{<Tag tag={userStorie.status}/>}</span>
                            </div>
                        }
                    >
                        {
                            (userStorie.tasks.length === 0) ?
                                (<Empty description="Il n'y a pas de tickets"/>)
                                :
                                <TaskList tasks={userStorie.tasks }/>
                        }
                    </Panel>
                )}
                </Collapse>
                    </div>
            }
        </div>
    );
};

UserStory.propTypes = {
    userStories: PropTypes.array.isRequired,
};

export default UserStory;
