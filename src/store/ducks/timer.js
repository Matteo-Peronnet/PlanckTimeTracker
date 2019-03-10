import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {ipcRenderer} from "electron";
import {of} from "rxjs";
import {replace} from "connected-react-router";

const START_TIMER_REQUEST = "timer/START_TIMER_REQUEST"

// Reducer
const INITIAL_STATE = {
    target: {
        customerId: null,
        projectId: null,
        taskType: null,
        taskId: null,
        totalTime: null
    }
}

export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case START_TIMER_REQUEST: {
            return {
                ...state,
                target: {
                    ...state.target,
                    customerId: action.customerId,
                    projectId: action.projectId,
                    taskType: action.taskType,
                    taskId: action.taskId
                }
            }
        }
        default:
            return state
    }
}


export function startTimerRequest(payload) {
    return {
        type: START_TIMER_REQUEST,
        customerId: payload.customerId,
        projectId: payload.projectId,
        taskType: payload.taskType,
        taskId: payload.taskId
    }
}


export const epic = combineEpics(
    startTimerRequestEpic
)


export function startTimerRequestEpic(action$, state$) {
    return action$.pipe(
        ofType(START_TIMER_REQUEST),
        mergeMap(() => {
            return of(replace('/timer'));
        })
    )
}
