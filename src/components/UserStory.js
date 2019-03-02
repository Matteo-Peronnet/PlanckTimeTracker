import React from "react";
import PropTypes from "prop-types";
import {Card, Empty} from 'antd';
import TaskList from './TaskList'
import Tag from "./Tag";

export const UserStory = (props) => {

    const { userStories } = props

    return (
        <div>
            {
                userStories.length === 0 ?
                    (<Empty description="Il n'y a pas d'User Story"/>)
                    :
                userStories.map((userStorie) =>
                    <Card
                        key={userStorie.id}
                        title={<p className="ws-normal">{userStorie.title}</p>}
                        bordered={false}
                        className={"flex flex-auto flex-column"}>
                        {
                            (userStorie.tasks.length === 0) ?
                                (<Empty description="Il n'y a pas de tickets"/>)
                                :
                                <TaskList tasks={userStorie.tasks }/>
                        }
                    </Card>
                )
            }
        </div>
    );
};

UserStory.propTypes = {
    userStories: PropTypes.array.isRequired,
};

export default UserStory;
