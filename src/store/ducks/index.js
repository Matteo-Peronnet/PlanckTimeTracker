import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'

export const reducer = combineReducers({
    reduxAsyncConnect,
    router: routerReducer,
}, window.__data)

export const epic = combineEpics(
)
