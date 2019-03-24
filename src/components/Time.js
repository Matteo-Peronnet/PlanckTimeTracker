import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";

export const Time = (props) => {

    const {time} = props;

    return (
        <span>{moment.duration(time, 'minutes').format("hh:mm", { trim: false })}</span>
    );
}

Time.propTypes = {
    time: PropTypes.number.isRequired,
};

export default Time;
