import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {ipcRenderer} from "electron";
import {of, NEVER} from "rxjs";
import {replace} from "connected-react-router";
import {storage} from "../../i18n";
import { LOGOUT_SUCCESS } from './user';
const START_TIMER_REQUEST = "timer/START_TIMER_REQUEST"
const RESTORE_TIMER_REQUEST = "timer/RESTORE_TIMER_REQUEST"
const RESET_TIMER = "timer/RESET_TIMER"

// Reducer
const INITIAL_STATE = {
    target: {
        customerId: null,
        projectId: null,
        taskType: null,
        taskId: null,
        totalTime: 0
    },
    timer: {
        active: false,
        initialDuration: 0,
        unit: "minutes",
        pause: false,
    }
}

export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case RESTORE_TIMER_REQUEST:
            return {
                ...action.payload
            }
        case START_TIMER_REQUEST: {
            return {
                ...state,
                target: {
                    ...state.target,
                    ...action.payload
                }
            }
        }
        case RESET_TIMER: {
            return {
                ...INITIAL_STATE
            };
        }
        default:
            return state
    }
}


export function startTimerRequest(payload) {
    return {
        type: START_TIMER_REQUEST,
        payload
    }
}

export function restoreTimerRequest(payload) {
    return {
        type: RESTORE_TIMER_REQUEST,
        payload
    }
}

export function resetTimer() {
    return {
        type: RESET_TIMER,
    }
}


export const epic = combineEpics(
    startTimerRequestEpic,
)


export function startTimerRequestEpic(action$, state$) {
    return action$.pipe(
        ofType(START_TIMER_REQUEST, RESTORE_TIMER_REQUEST),
        mergeMap(() => {
            return of(replace('/timer'));
        })
    )
}
