import React from "react";
import { NEVER, of, from } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { push } from 'connected-react-router'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'
import {login} from "../services/authentication";
import { openNotificationByType } from '../../utils'
import {ipcRenderer} from "electron";

const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';

const LOGOUT_REQUEST = 'user/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';

// Initial state
const INITIAL_STATE = {
    id: null,
    firstname: null,
    lastname: null,
    isLogged: false,
    loading: false,
    token: null
}

// Reducer
export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                id: action.payload.id,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                token: action.payload.token,
                isLogged: true,
                loading: false
            }
        case LOGIN_FAILURE: {
            return {
                ...state,
                loading: false,
            }
        }
        case LOGOUT_SUCCESS: {
            return {
                ...INITIAL_STATE
            }
        }
        default:
            return state
    }
}

export function loginRequest(payload) {

    return {
        type: LOGIN_REQUEST,
        payload
    }
}
export function loginSuccess(payload) {
    return {
        type: LOGIN_SUCCESS,
        payload
    }
}
export function loginFailure(payload) {
    return {
        type: LOGIN_FAILURE,
        payload
    }
}

export const logoutRequest = () => dispatch => {
    console.log('hi')
    ipcRenderer.send('deleteToken');
    ipcRenderer.on('deleteTokenResult', (event) => {
        dispatch({ type: LOGOUT_SUCCESS });
    });
};

export const epic = combineEpics(
    loginRequestEpic,
    loginFailureEpic,
    loginSuccessEpic
)

export function loginRequestEpic(action$) {
    return action$.pipe(
        ofType(LOGIN_REQUEST),
        mergeMap(({payload}) =>
            ajax(
                login(payload)
            ).pipe(
                map((res) => loginSuccess({token: payload, ...res.response})),
                catchError((err) => of(loginFailure(err))),
            ),
        ),
    )
}

export function loginFailureEpic(action$) {
    return action$.pipe(
        ofType(LOGIN_FAILURE),
        mergeMap(() => {
            openNotificationByType('error', 'Échec de la connexion', 'Le token saisie est invalide')
            return NEVER
        }),
    )
}

export function loginSuccessEpic(action$, state$) {
    return action$.pipe(
        ofType(LOGIN_SUCCESS),
        mergeMap(() => {
            ipcRenderer.send('setToken', state$.value.user.token)
            return of(push('/'));
        })
    )
}
