import React from "react";
import PropTypes from 'prop-types';

export const Time = (props) => {

    const {time} = props;

    if (time < 60) {
        return <span>{time}min</span>
    }

    const hour = Math.round(time / 60);
    const min = Math.round((time / 60 - Math.round(time / 60)) * 60);

    return (
        <span>{hour}h{min > 0 && (min)}</span>
    );
}

Time.propTypes = {
    time: PropTypes.number.isRequired,
};

export default Time;
