import { ajax } from 'rxjs/ajax'
import { getProject } from '../services/task';
import { map, catchError } from 'rxjs/operators';

const GET_PROJECT_REQUEST = 'customer/GET_PROJECT_REQUEST';
const GET_PROJECT_FAILURE = 'customer/GET_PROJECT_FAILURE';
const GET_PROJECT_SUCCESS = 'customer/GET_PROJECT_SUCCESS';

// Initial state
const INITIAL_STATE = {
    list: []
}

// Reducer
export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                list: state.list.concat(action.result)
            }
        default:
            return state
    }
}


export function getProjectRequest(id) {
    return {
        types: [GET_PROJECT_REQUEST, GET_PROJECT_SUCCESS, GET_PROJECT_FAILURE],
        promise: (getState) => ajax(getProject(id)).pipe(
            map((res) => {
                return { projectId: id, ...res.response}
            }),
            catchError((error) => Promise.reject(error)),
        ).toPromise()
    }
}
