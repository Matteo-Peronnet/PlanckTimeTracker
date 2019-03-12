import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import {Button, TimePicker} from "antd";
import moment from 'moment';


export const Tracker = (props) => {

    const { display, pause } = props;

    const buttonStyle = {
        height: "70px",
        padding: "0 20px",
        fontSize: "32px",
        borderWidth: 0
    }

    const format = 'HH:mm';

    return (
        <div className="flex flex-auto flex-column items-center justify-between">
            {
                !pause ?
                    <Fragment>
                        <Button type="primary" style={buttonStyle} loading ghost>{display}</Button>
                        <Button className="mt3" type="danger" ghost onClick={() => props.handleTimerPause()}>PAUSE</Button>
                    </Fragment>
                    :
                    <Fragment>
                        <TimePicker onChange={props.onTimeChange} value={moment(display, format)} format={format} />
                        <Button className="mt3" onClick={() => props.handleTimerStart()}>DÉMARRER</Button>
                    </Fragment>
            }
        </div>
    )

};

Tracker.propTypes = {
    display: PropTypes.string.isRequired,
    pause: PropTypes.bool.isRequired,
    handleTimerPause: PropTypes.func.isRequired,
    handleTimerStart: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
};

export default Tracker;
