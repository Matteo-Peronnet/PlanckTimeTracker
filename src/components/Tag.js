import React from "react";
import { Tag as AntTag } from 'antd';
import PropTypes from 'prop-types';

export const Tag = (props) => {

    const { tag } = props;

    return (
        <AntTag
            key={tag}
            color={
            tag === 'todo' ? 'blue' :
            tag === 'wip' ? 'orange' :
            tag === 'done' ? 'green' :
            tag === 'pr' ? 'purple' :
            ''
            }
        >
            {tag.toUpperCase()}
        </AntTag>
    );
};

Tag.propTypes = {
    tag: PropTypes.string.isRequired,
};

export default Tag;
