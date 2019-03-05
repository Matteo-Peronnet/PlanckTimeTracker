import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import {getProjectRequest, getCustomersRequest} from "../../../store/ducks/planck";
import { Button, Card, Empty, Divider, Row, Col, Icon, Progress} from "antd";
import TimeAgo from 'react-timeago';
import frenchStrings from 'react-timeago/lib/language-strings/fr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import Tag from "../../../components/Tag";
import Time from "../../../components/Time";
import { openUrl } from "../../../utils";
import { withRouter } from "react-router-dom";

const formatter = buildFormatter(frenchStrings)

@asyncConnect([
    {
        promise: ({ store: { dispatch, getState }, match: { params: {customerId, projectId, taskType, taskId} } }) => {
            const promises = [];
            customerId = parseInt(customerId);
            projectId = parseInt(projectId);

            const {planck: {entities: {customers, projects}}} = getState();

            // Check if we already have the customer
            if (!customers[customerId]) {
                promises.push(dispatch(getCustomersRequest()));
            }

            // Check if we have the project
            if (projects[projectId]) {

                // Check if we have already the tasks/sprints/supportTasks of the project
                if(!projects[projectId].tasks && !projects[projectId].sprints && !projects[projectId].supportTasks) {
                    promises.push(dispatch(getProjectRequest(projectId)));
                }
            } else {
                // We don't have the project
                promises.push(dispatch(getProjectRequest(projectId)));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    (state, {match: {params: {customerId, projectId, taskType, taskId}}}) => {
        return ({
            customer: state.planck.entities.customers[customerId],
            project: state.planck.entities.projects[projectId],
            task: state.planck.entities[taskType][taskId],
        })
    },
    dispatch => ({
    }),
)
class Task extends React.Component {

    render() {
        const { task, customer, project } = this.props;

        const allTimeSpent = task.spentTimes.reduce((acc, curr) => acc + curr.time, 0);

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <div style={{padding: "15px 10px 30px"}}>
                            <div className={"flex flex-auto items-center"} style={{ padding: "16px 32px", border: "1px solid rgb(235, 237, 240)", paddingRight: 0}}>
                                <span style={{cursor: 'pointer'}} onClick={this.props.history.goBack}>
                                    <Icon type="arrow-left-o" />
                                </span>
                                <Divider type="vertical" />
                                <div className="flex flex-auto items-center justify-between">
                                    <span className="fw7"><span className="fw8">{`#${task.uid.uid}`}</span> {`${task.title}`}</span>
                                    <span><Tag type="status" tag={task.status}/></span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{ padding: "15px 0px", border: "1px solid rgb(235, 237, 240)", position: 'relative'}}>
                        <div>
                            <h3 className="tc">Informations</h3>
                        </div>
                        <div className="flex flex-auto items-center justify-between" style={{padding: "0px 10px 0px 15px"}}>
                            <div>
                                <span className="fw6">Crée par :</span> {task.author.firstname} {task.author.lastname}, <span className="i"><TimeAgo date={task.createdAt} formatter={formatter}/></span>
                            </div>
                        </div>
                        <div className="flex flex-auto items-center justify-between mt2" style={{padding: "0px 10px 0px 15px"}}>
                            <div>
                                <span className="fw6">Assigné à : </span> {
                                task.assignedTo ? <span>{task.assignedTo.firstname} {task.assignedTo.lastname}</span>
                                    :
                                <Button size="small" style={{ verticalAlign: 'middle' }}>
                                    S'assigner
                                </Button>
                                }
                            </div>
                            <div>
                                <span className="fw5">Type :</span> <Tag type="type" color={task.type ? task.type.color : ''} tag={task.type ? task.type.label : ''}/>
                            </div>
                        </div>
                        </div>
                        <div style={{position: 'absolute', top: 12, right: 10}}>
                            <Button
                                type="primary"
                                icon="global"
                                size={"small"}
                                onClick={() => openUrl(`${process.env.PLANCK_HOST}/${customer.slug}/${project.slug}/task/${task.uid.uid}/show`)}
                            />
                        </div>
                    </Col>
                </Row>
                <h3 className="tc mt3">Temps passé</h3>
                <Row>
                    <Col span={11}>
                        <div className="flex flex-auto items-center justify-center">
                            {
                                task.estimatedTime ?
                                    <Progress
                                        type="circle"
                                        percent={Math.round((allTimeSpent/task.estimatedTime)*100)}
                                        status={task.estimatedTime ? allTimeSpent > task.estimatedTime ? "exception" : 'normal' : 'normal'}
                                        showInfo={true}
                                        format={() => <Time time={allTimeSpent}/>} />
                                    :
                                    <Progress
                                        type="circle"
                                        percent={0}
                                        showInfo={true}
                                        format={() => <Time time={allTimeSpent}/>} />
                            }
                        </div>
                    </Col>
                    <Col span={2}>
                        <div className="flex flex-auto items-center justify-center">
                            <Divider type="vertical" style={{height: '120px'}} />
                        </div>
                    </Col>
                    <Col span={11}>
                        <div className="flex flex-auto items-start justify-center flex-column">
                            <div>
                                <span className="fw6">Temps passé :</span> <Time time={allTimeSpent}/>
                            </div>
                            <div>
                                <span className="fw6">Temps estimé :</span> <Time time={task.estimatedTime || 0}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="flex flex-row flex-auto items-center w-100 mt4">
                    <Row>
                        <Col span={24}>
                            <Card style={{width: '100vw'}}>
                                {
                                    task.description ?
                                        <Fragment>
                                            <h3 className="tc">Description</h3>
                                            <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                        </Fragment>
                                        :
                                        <Empty description={"Il n'y a pas de description"}/>
                                }
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <div className="flex flex-row flex-auto justify-center items-center mt1" style={{padding: "15px 0px"}}>
                        <Button type="primary" icon="dashboard" size={"default"}>Démarrer timer</Button>
                    </div>
                </Row>
            </div>
        );
    }
}

export default withRouter(Task)
