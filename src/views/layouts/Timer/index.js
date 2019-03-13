import React  from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { withRouter } from "react-router-dom";
import isPrivate from "../../../routes/isPrivate";
import { getTimeSpentTypesRequest, postTimeSpentRequest } from "../../../store/ducks/planck";
import { resetTimer } from "../../../store/ducks/timer";
import { ipcRenderer } from "electron";
import { intl } from '../../../i18n'
import {FormattedMessage, injectIntl} from 'react-intl'
import { Steps, Form, Button, Popconfirm, Modal} from 'antd';
import { storage } from "../../../i18n";
import TimeTracker from "./Timer";
import {Ov} from "../../../utils";
import TimerStep from './TimerStep';
import Tracker from './Steps/Tracker';
import TimerInformation from './Steps/TimerInformation';
import withUser from "../../../routes/withUser";
import {push} from "connected-react-router";
import moment from 'moment';

const Step = Steps.Step;
const confirm = Modal.confirm;

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

        this.askRemoveIddleTime = this.askRemoveIddleTime.bind(this);

        // --------- ELECTRON EVENT ---------
        ipcRenderer.on('closeAppRequest', (event) => {
            // Save the timer before close the application
            if (this.state.saveTimer) {
                this.saveTimerInStorage();
            }
            ipcRenderer.send('closeApp')
        });

        ipcRenderer.on('unlockScreen', (event, iddleTime) => {
            const { pathname } = this.props;
            const { timer: {pause} } = this.state;
            // If we are in timer view and timer was not paused
            if (pathname === '/timer' && !pause) {
                this.handleTimerPause();
                this.askRemoveIddleTime(iddleTime);
            }
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

    askRemoveIddleTime (iddleTime) {
        // https://stackoverflow.com/questions/52649980/react-ant-modal-props-of-undefined
        let self = this;
        confirm({
            title: intl.formatMessage({ id: 'pages.timer.modal.iddle.title' }),
            content: `${intl.formatMessage({ id: 'pages.timer.modal.iddle.content' })} ${iddleTime}min`,
            onOk() {
                let newTime = (self.state.timer.initialDuration + self.state.target.totalTime) - iddleTime;
                self.updateTimeManually(newTime)
            },
            onCancel() {},
            okText: intl.formatMessage({ id: 'shared.yes' }),
            cancelText: intl.formatMessage({ id: 'shared.no' }),
        });
    }

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
                    pause: false,
                    saveTimer: true
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
                },
                saveTimer: true
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
                display: newDisplay,
                saveTimer: true
            };
        });

        // handler for electron tray title
        this.updateTrayText(newDisplay);
    };

    saveTimerInStorage = () => {
        console.log('GO SAVE')
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
            stepIndex: index,
            saveTimer: true
        })
    }

    onTimeChange = (time) => {
        const totalTime = time.hours()*60+time.minutes();
        this.updateTimeManually(totalTime);
    }

    updateTimeManually = (totalTime) => {
        this.setState({
            ...this.state,
            timer: {
                ...this.state.timer,
                initialDuration: totalTime
            },
            saveTimer: true
        }, () => {
            this.refreshTimer();
        })
    }

    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.disableTimerSaving(() => {
                    const {display, target: {projectId, taskId, taskType, customerId}} = this.state;
                    this.props.dispatch(postTimeSpentRequest({
                        target: {
                            projectId,
                            taskId,
                            taskType,
                            customerId
                        },
                        data: {
                            description: values.description || '',
                            timeSpentType: values.select,
                            startDate: moment(values.startDate).format('DD/MM/YYYY hh:mm'),
                            timeSpentTime: display
                        }
                    }))
                })
            }
        });
    }

    disableTimerSaving(cb) {
        this.setState({
            ...this.state,
            saveTimer: false
        }, cb)
    }

    leaveTimer = () => {
        this.disableTimerSaving(() => {
            const { customerId, projectId } = this.state.target;
            storage.delete('timer');
            this.props.dispatch(resetTimer())
            this.props.dispatch(push(`/customer/${customerId}/project/${projectId}`))
        })
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
                            display={display || ''}
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
