import React from "react";
import { Avatar as AntAvatar } from 'antd';
import PropTypes from 'prop-types';

export const Avatar = (props) => {

    const { userId, size } = props;

    return(
        <AntAvatar
            shape="square"
            size={size}
            icon="user"
            src={`https://planck.troopers.agency/user/${userId}/avatar`}
        />
    )

};

Avatar.propTypes = {
    userId: PropTypes.number.isRequired,
};

Avatar.defaultProps = {
    size: "large"
}

export default Avatar;
