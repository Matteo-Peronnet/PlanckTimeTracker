import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { withRouter } from "react-router-dom";
import isPrivate from "../../../routes/isPrivate";
import { injectIntl, FormattedMessage } from 'react-intl'
import { ipcRenderer } from "electron";
import { Statistic } from 'antd';
import { store } from "../../../i18n";

import TimeTracker from "./Timer";
import {Ov} from "../../../utils";
import {getTimeSpentTypesRequest} from "../../../store/ducks/planck";

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const {planck: {entities: {timeSpentTypes}}} = getState();

            const promises = [];

            if (Ov(timeSpentTypes).length === 0) {
                promises.push(dispatch(getTimeSpentTypesRequest()));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    (state) => ({
        timer: state.timer
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
            ...props.timer
        }
    }

    componentDidMount() {
        this.initializeTimer();
        this.handleInitialValues();
        if(!this.state.timer.pause){
            this.handleTimerStart();
        }
    }


    componentWillUnmount() {
        this.timer.stop();
        this.saveTimerInStorage();
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

    initializeTimer() {
        const timerConfig = {
            initialDuration: this.state.timer.initialDuration,
            unit: this.state.timer.unit,
            onDisplayChange: this.handleTimerUpdate,
        };
        this.timer = new TimeTracker(timerConfig);
    }

    handleInitialValues () {
        this.setState({
            ...this.state,
            timer: {
                ...this.state.timer,
                display: this.timer.getTimeDisplay()
            }
        });
        this.updateTrayText(this.state.timer.display)
    }

    handleTimerStart = () => {
        this.timer.start(() => {
            // sending a callback so there is no delay in rendering start/stop buttons
            this.setState({
                timer: { ...this.state.timer, active: true, pause: false }
            });
        });
    };

    handleTimerPause = () => {
        this.timer.stop(() => {
            this.setState({
                ...this.state,
                target: {
                    ...this.state.target,
                    totalTime: 0
                },
                timer: {
                    ...this.state.timer,
                    initialDuration: this.state.timer.initialDuration + this.state.target.totalTime,
                    pause: true
                }
            });
        })
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

    saveTimerInStorage = () => {
        store.set('timer', {
            ...this.state,
            target: {
                ...this.state.target,
                totalTime: 0
            },
            timer: {
                ...this.state.timer,
                initialDuration: this.state.timer.initialDuration + this.state.target.totalTime,
                pause: true
            }
        });
    }

    render() {

        const { timer } = this.state;

        return (
            <Fragment>
                <div>
                    <Statistic title="Temps passé" value={timer.display} />
                </div>
                {
                    !timer.pause ?
                        <button onClick={() => this.handleTimerPause()}>PAUSE</button>
                        :
                        <button onClick={() => this.handleTimerStart()}>REPRENDRE</button>
                }
            </Fragment>
        );
    }
}

export default Timer
