import React from "react";
import { NEVER, of, from } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { push } from 'connected-react-router'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'
import {login, getAccount, loginCheck} from "../services/authentication";
import { openNotificationByType } from '../../utils'
import {intl, storage} from "../../i18n";
import {resetTimer} from "./timer";

export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';

export const LOGIN_CHECK_REQUEST = 'user/LOGIN_CHECK_REQUEST';
export const LOGIN_CHECK_FAILURE = 'user/LOGIN_CHECK_FAILURE';
export const LOGIN_CHECK_SUCCESS = 'user/LOGIN_CHECK_SUCCESS';

export const GET_ACCOUNT_REQUEST = 'user/GET_ACCOUNT_REQUEST';
export const GET_ACCOUNT_FAILURE = 'user/GET_ACCOUNT_FAILURE';
export const GET_ACCOUNT_SUCCESS = 'user/GET_ACCOUNT_SUCCESS';

export const LOGOUT_REQUEST = 'user/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';

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
        case LOGIN_CHECK_REQUEST:
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case GET_ACCOUNT_SUCCESS:
            return {
                ...state,
                id: action.payload.id,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                token: action.payload.token,
                isLogged: true,
                loading: false
            }
        case GET_ACCOUNT_FAILURE:
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
    storage.delete('refresh_token');
    dispatch({ type: LOGOUT_SUCCESS });
    dispatch(resetTimer());
};

export function getAccountRequest (token) {
    return {
        type: GET_ACCOUNT_REQUEST,
        token
    }
}

export function getAccountSuccess (payload) {
    return {
        type: GET_ACCOUNT_SUCCESS,
        payload
    }
}

export function getAccountFailure (payload) {
    return {
        type: GET_ACCOUNT_FAILURE,
        payload
    }
}

export function loginCheckRequest(refreshToken) {
    return {
        type: LOGIN_CHECK_REQUEST,
        refreshToken
    }
}

export function loginCheckSuccess(payload) {
    return {
        type: LOGIN_CHECK_SUCCESS,
        payload
    }
}

export function loginCheckFailure(payload) {
    return {
        type: LOGIN_CHECK_FAILURE,
        payload
    }
}

export const epic = combineEpics(
    loginRequestEpic,
    loginFailureEpic,
    loginSuccessEpic,
    loginCheckRequestEpic,
    accountRequestEpic,
)

export function loginRequestEpic(action$) {
    return action$.pipe(
        ofType(LOGIN_REQUEST),
        mergeMap(({payload}) =>
            ajax(
                login(payload)
            ).pipe(
                map((res) => {
                    storage.set('refresh_token', res.response.refresh_token)
                    return getAccountRequest(res.response.token);
                }),
                catchError((err) => of(loginFailure(err))),
            ),
        ),
    )
}

export function loginCheckRequestEpic(action$) {
    return action$.pipe(
        ofType(LOGIN_CHECK_REQUEST),
        mergeMap(({refreshToken}) =>
            ajax(
                loginCheck(refreshToken)
            ).pipe(
                map((res) => {
                    storage.set('refresh_token', res.response.refresh_token)
                    return getAccountRequest(res.response.token)
                }),
                catchError((err) => of(loginCheckFailure(err))),
            ),
        ),
    )
}

export function accountRequestEpic(action$) {
    return action$.pipe(
        ofType(GET_ACCOUNT_REQUEST),
        mergeMap(({token}) =>
            ajax(
                getAccount(token)
            ).pipe(
                map((res) => getAccountSuccess({token, ...res.response})),
                catchError((err) => of(getAccountFailure(err))),
            ),
        ),
    )
}

export function loginSuccessEpic(action$, state$) {
    return action$.pipe(
        ofType(GET_ACCOUNT_SUCCESS),
        mergeMap(() => {
            return of(push('/'));
        })
    )
}

export function loginFailureEpic(action$) {
    return action$.pipe(
        ofType(LOGIN_FAILURE, GET_ACCOUNT_FAILURE),
        mergeMap(() => {
            openNotificationByType('error', intl.formatMessage({ id: 'form.errors.connectionError' }), intl.formatMessage({ id: 'form.errors.invalidEmailPassword' }))
            return NEVER
        }),
    )
}
