import { ajax } from 'rxjs/ajax'
import { normalize, denormalize } from 'normalizr';
import { getCustomers } from '../services/customer';
import { map, catchError } from 'rxjs/operators';
import {timeSpentTypeSchema, customersSchema, projectSchema} from "../schemas";
import {getProject} from "../services/task";
import {getTimeSpentType} from "../services/timeSpentType";

const GET_CUSTOMERS_REQUEST = 'customer/GET_CUSTOMERS_REQUEST';
const GET_CUSTOMERS_FAILURE = 'customer/GET_CUSTOMERS_FAILURE';
const GET_CUSTOMERS_SUCCESS = 'customer/GET_CUSTOMERS_SUCCESS';

const GET_PROJECT_REQUEST = 'project/GET_PROJECT_REQUEST';
const GET_PROJECT_FAILURE = 'project/GET_PROJECT_FAILURE';
const GET_PROJECT_SUCCESS = 'project/GET_PROJECT_SUCCESS';

const GET_TIME_SPENT_TYPES_REQUEST = 'timeSpentType/GET_TIME_SPENT_TYPES_REQUEST';
const GET_TIME_SPENT_TYPES_FAILURE = 'timeSpentType/GET_TIME_SPENT_TYPES_FAILURE';
const GET_TIME_SPENT_TYPES_SUCCESS = 'timeSpentType/GET_TIME_SPENT_TYPES_SUCCESS';


// Initial state
const INITIAL_STATE = {
    entities: {
        projects: {},
        customers: {},
        sprints: {},
        userStories: {},
        usTasks: {},
        tasks: {},
        supportTasks: {},
        timeSpentTypes: {}
    }
}

// Reducer
export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case GET_TIME_SPENT_TYPES_SUCCESS:
        case GET_PROJECT_SUCCESS:
        case GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    customers: {
                        ...state.entities.customers,
                        ...action.result.entities.customers
                    },
                    projects: {
                        ...state.entities.projects,
                        ...action.result.entities.projects
                    },
                    sprints: {
                        ...state.entities.sprints,
                        ...action.result.entities.sprints
                    },
                    userStories: {
                        ...state.entities.userStories,
                        ...action.result.entities.userStories
                    },
                    usTasks: {
                        ...state.entities.usTasks,
                        ...action.result.entities.usTasks
                    },
                    tasks: {
                        ...state.entities.tasks,
                        ...action.result.entities.tasks
                    },
                    supportTasks: {
                        ...state.entities.supportTasks,
                        ...action.result.entities.supportTasks
                    },
                    timeSpentTypes: {
                        ...state.entities.timeSpentTypes,
                        ...action.result.entities.timeSpentTypes
                    }
                },
            }
        default:
            return state
    }
}

export function getCustomersRequest() {
    return {
        types: [GET_CUSTOMERS_REQUEST, GET_CUSTOMERS_SUCCESS, GET_CUSTOMERS_FAILURE],
        promise: (getState) => ajax(getCustomers(getState().user.token)).pipe(
            map((res) => normalize(res.response, [customersSchema])),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}

export function getProjectRequest(id) {
    return {
        types: [GET_PROJECT_REQUEST, GET_PROJECT_SUCCESS, GET_PROJECT_FAILURE],
        promise: (getState) => ajax(getProject(getState().user.token,id)).pipe(
            map((res) =>
                normalize({
                    project: {
                        ...getState().planck.entities.projects[id],
                        ...res.response
                    }
                }, [projectSchema])
            ),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}

export function getTimeSpentTypesRequest() {
    return {
        types: [GET_TIME_SPENT_TYPES_REQUEST, GET_TIME_SPENT_TYPES_SUCCESS, GET_TIME_SPENT_TYPES_FAILURE],
        promise: (getState) => ajax(getTimeSpentType(getState().user.token)).pipe(
            map((res) =>
                normalize(res.response, [timeSpentTypeSchema])
            ),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}
