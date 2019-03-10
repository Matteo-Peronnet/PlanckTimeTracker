import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { withRouter } from "react-router-dom";
import isPrivate from "../../../routes/isPrivate";
import { injectIntl, FormattedMessage } from 'react-intl'
import { ipcRenderer } from "electron";
import TimeTracker from "./Timer";


const INITIAL_STATE = {
    timer: {
        active: false,
        time: 1000,
        unit: "minutes",
        display: ""
    }
};

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
        },
    },
])
@connect(
    (state) => ({
        task: state.timer.target
    }),
    dispatch => ({
    }),
)
@isPrivate
@injectIntl
@withRouter
class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...null /* RETRIEVE TIMER IN STORAGE */ || INITIAL_STATE,
            target: {
                ...props.task
            }
        };
    }

    componentDidMount() {
        this.initializeTimer();
        this.handleTimerStart();
    }


    componentWillUnmount() {
        this.timer.stop();
        this.resetTimerTray();
    }

    // ----------------------------------
    // --------- ELECTRON EVENT ---------
    // ----------------------------------
    updateTrayText = title => {
        ipcRenderer.send("update-timer", title);
    };

    resetTimerTray = () => {
        ipcRenderer.send("update-timer", "");
    };
    // --------- ELECTRON EVENT ---------

    initializeTimer(timerSettings = {}) {
        const { time, unit } = timerSettings;
        const timerConfig = {
            duration: time || this.state.timer.time,
            unit: unit || this.state.timer.unit,
            onDisplayChange: this.handleTimerUpdate,
        };
        this.timer = new TimeTracker(timerConfig);
    }

    handleActivation = () => {
        this.initializeTimer();
        this.setState({
            timer: {
                ...this.state.timer,
                display: this.timer.display,
                isPaused: this.timer.isPaused
            }
        });
    };

    handleTimerStart = () => {
        this.timer.start(() => {
            // sending a callback so there is no delay in rendering start/stop buttons
            this.setState({
                timer: { ...this.state.timer, active: true }
            });
        });
    };

    handleTimerPause = () => {
        this.timer.pause(() => {
            this.setState({
                timer: { ...this.state.timer, isPaused: true }
            })
        });
    }
    handleTimerRestart = () => {
        this.timer.restart(() => {
            this.setState({
                timer: { ...this.state.timer, isPaused: false }
            })
        });
    }

    handleTimerStop = () => {
        this.timer.stop(() => {
            this.setState({
                timer: {...this.state.timer, active: false}
            });
        });
    };

    handleTimerUpdate = (newDisplay) => {
        this.setState(prevState => {
            const { timer, target } = prevState;
            const { active } = timer;
            return {
                timer: { ...timer, display: newDisplay },
                target: {
                    ...target,
                    totalTime: active ? target.totalTime + 1 : target.totalTime
                }
            };
        });

        // handler for electron tray title
        this.updateTrayText(newDisplay);
    };

    render() {

        const { timer } = this.state;

        return (
            <Fragment>
                <div>{timer.display}</div>
                {
                    !timer.isPaused ?
                        <button onClick={() => this.handleTimerPause()}>PAUSE</button>
                        :
                        <button onClick={() => this.handleTimerRestart()}>REPRENDRE</button>
                }
            </Fragment>
        );
    }
}

export default Timer
