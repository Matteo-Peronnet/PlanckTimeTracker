import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { withRouter } from "react-router-dom";
import isPrivate from "../../../routes/isPrivate";
import { injectIntl, FormattedMessage } from 'react-intl'
import {getTimeSpentTypesRequest} from "../../../store/ducks/planck";
import { ipcRenderer } from "electron";
import {Statistic, Steps, Icon, Form} from 'antd';
import { storage } from "../../../i18n";
import TimeTracker from "./Timer";
import {Ov} from "../../../utils";
import TimerStep from './TimerStep';
import Tracker from './Steps/Tracker';
import TimeInformation from './Steps/TimeInformation';

const Step = Steps.Step;

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
        timer: state.timer,
        timeSpentTypes: Ov(state.planck.entities.timeSpentTypes)
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
            ...props.timer,
            stepIndex: 0
        }

        // --------- ELECTRON EVENT ---------
        ipcRenderer.on('closeAppRequest', (event) => {
            // Save the timer before close the application
            this.saveTimerInStorage();
            ipcRenderer.send('closeApp')
        });
        // --------- ELECTRON EVENT ---------
    }

    componentDidMount() {
        this.refreshTimer();
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

    refreshTimer () {
        this.initializeTimer();
        if(!this.state.timer.pause){
            this.handleTimerStart();
        }
        this.timer.updateDisplayWithoutUpdateTimer();
    }

    initializeTimer() {
        const timerConfig = {
            initialDuration: this.state.timer.initialDuration,
            unit: this.state.timer.unit,
            onDisplayChange: this.handleTimerUpdate,
        };
        this.timer = new TimeTracker(timerConfig);
    }

    handleTimerStart = () => {
        this.timer.start(() => {
            // sending a callback so there is no delay in rendering start/stop buttons
            this.setState({
                timer: {
                    ...this.state.timer,
                    active: true,
                    pause: false
                }
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

    handleTimerUpdate = (newDisplay, updateTimer = true) => {
        this.setState(prevState => {
            const { timer, target } = prevState;
            const { active } = timer;
            return {
                target: {
                    ...target,
                    totalTime: active && updateTimer ? target.totalTime + 1 : target.totalTime
                },
                display: newDisplay
            };
        });

        // handler for electron tray title
        this.updateTrayText(newDisplay);
    };

    saveTimerInStorage = () => {
        storage.set('timer', {
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

    onStepChange = (index) => {
        if (!this.state.pause) {
            this.handleTimerPause();
        }
        this.setState({
            stepIndex: index
        })
    }

    onTimeChange = (time) => {
        const totalTime = time.hours()*60+time.minutes();
        this.setState({
            ...this.state,
            timer: {
                ...this.state.timer,
                initialDuration: totalTime
            }
        }, () => {
            this.refreshTimer();
        })
    }

    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { display, timer, stepIndex } = this.state;
        const { timeSpentTypes, form } = this.props;
        const styleStepsContent = {
            marginTop: "16px",
            border: "1px dashed #e9e9e9",
            borderRadius: "6px",
            backgroundColor: "#fafafa",
            minHeight: "250px",
            textAlign: "center",
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }

        return (
            <div className="mt3 flex flex-auto flex-column">
                <Steps progressDot current={stepIndex} className="justify-center">
                    <Step title="Tracking" />
                    <Step title="Information" />
                </Steps>
                <TimerStep index={stepIndex} update={this.onStepChange} onSubmit={this.onSubmit}>
                    <div style={styleStepsContent}>
                        <Tracker
                            display={display}
                            pause={timer.pause}
                            handleTimerPause={this.handleTimerPause}
                            handleTimerStart={this.handleTimerStart}
                            onTimeChange={this.onTimeChange}
                        />
                    </div>
                    <div style={styleStepsContent}>
                        <TimeInformation
                            timeSpentTypes={timeSpentTypes}
                            form={form}
                        />
                    </div>
                </TimerStep>
            </div>
        );
    }
}

export default Form.create({ name: 'timeInformation' })(Timer)
