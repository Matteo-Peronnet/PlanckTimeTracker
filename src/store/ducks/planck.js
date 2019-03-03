import { ajax } from 'rxjs/ajax'
import { normalize, denormalize } from 'normalizr';
import { getCustomers } from '../services/customer';
import { map, catchError } from 'rxjs/operators';
import {boardSchema, customersSchema, projectSchema} from "../schemas";
import {getProject} from "../services/task";

const GET_CUSTOMERS_REQUEST = 'customer/GET_CUSTOMERS_REQUEST';
const GET_CUSTOMERS_FAILURE = 'customer/GET_CUSTOMERS_FAILURE';
const GET_CUSTOMERS_SUCCESS = 'customer/GET_CUSTOMERS_SUCCESS';

const GET_PROJECT_REQUEST = 'customer/GET_PROJECT_REQUEST';
const GET_PROJECT_FAILURE = 'customer/GET_PROJECT_FAILURE';
const GET_PROJECT_SUCCESS = 'customer/GET_PROJECT_SUCCESS';


// Initial state
const INITIAL_STATE = {
    entities: {
        projects: {},
        customers: {},
        sprints: {},
        userStories: {},
        usTasks: {},
        tasks: {},
        supportTasks: {}
    }
}

// Reducer
export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {

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
        promise: (getState) => ajax(getCustomers()).pipe(
            map((res) => normalize(res.response, [customersSchema])),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}

export function getProjectRequest(id) {
    return {
        types: [GET_PROJECT_REQUEST, GET_PROJECT_SUCCESS, GET_PROJECT_FAILURE],
        promise: (getState) => ajax(getProject(id)).pipe(
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
