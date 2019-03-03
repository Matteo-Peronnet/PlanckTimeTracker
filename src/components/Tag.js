import React from "react";
import { Tag as AntTag } from 'antd';
import PropTypes from 'prop-types';

export const Tag = (props) => {

    const { tag, type, color } = props;

    if (type === 'status') {
        return (
            <AntTag
                key={tag}
                color={
                    color ? color :
                    tag === 'todo' ? 'blue' :
                    tag === 'wip' ? 'orange' :
                    tag === 'done' ? 'green' :
                    tag === 'pr' ? 'purple' :
                    ''
                }
            >
                {tag.toUpperCase()}
            </AntTag>
        )
    }

    if (type === 'type') {
       return(
           <AntTag
            key={tag}
            color={color}
        >
            {tag}
        </AntTag>
       )
    }

};

Tag.propTypes = {
    tag: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

export default Tag;
