import React  from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { withRouter } from "react-router-dom";
import isPrivate from "../../../routes/isPrivate";
import { getTimeSpentTypesRequest } from "../../../store/ducks/planck";
import { resetTimer } from "../../../store/ducks/timer";
import { ipcRenderer } from "electron";
import {FormattedMessage, injectIntl} from 'react-intl'
import { Steps, Form, Button, Popconfirm} from 'antd';
import { storage } from "../../../i18n";
import TimeTracker from "./Timer";
import {Ov} from "../../../utils";
import TimerStep from './TimerStep';
import Tracker from './Steps/Tracker';
import TimerInformation from './Steps/TimerInformation';
import withUser from "../../../routes/withUser";
import {push} from "connected-react-router";
const Step = Steps.Step;

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const {planck: {entities: {timeSpentTypes}}} = getState();

            const promises = [];

            const {
                planck: {entities: { projects }},
                timer: {target: {projectId}}
            } = getState();

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
@withUser
@withRouter
class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props.timer,
            stepIndex: 0,
            saveTimer: true
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
        if (this.state.saveTimer) {
            this.saveTimerInStorage();
        }
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

    leaveTimer = () => {
        this.setState({
            ...this.state,
            saveTimer: false
        }, () => {
            storage.delete('timer');
            this.props.dispatch(resetTimer())
            this.props.dispatch(push('/'))
        })
    }

    render() {
        const { display, timer, stepIndex } = this.state;
        const { timeSpentTypes, form, task } = this.props;
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
            <div className="flex flex-auto flex-column">
                <div className="flex flex-auto items-center justify-end" style={{padding: '0 15px'}}>
                    <Popconfirm placement="bottomRight" title={<FormattedMessage id="pages.timer.delete" />} onConfirm={this.leaveTimer} okText={<FormattedMessage id="shared.yes" />} cancelText={<FormattedMessage id="shared.no" />}>
                        <Button type="danger" shape="circle" icon="close" size="default" />
                    </Popconfirm>
                </div>
                <Steps progressDot current={stepIndex} className="justify-center">
                    <Step title={<FormattedMessage id="pages.timer.tracker" />} />
                    <Step title={<FormattedMessage id="pages.timer.information" />} />
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
                        <TimerInformation
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
