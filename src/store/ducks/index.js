import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as customerReducer } from './customer'


export const reducer = combineReducers({
    reduxAsyncConnect,
    router: routerReducer,
    customer: customerReducer
}, window.__data)

export const epic = combineEpics(
)
