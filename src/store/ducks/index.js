import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as customerReducer } from './customer'
import { reducer as taskReducer } from './task'


export const reducer = combineReducers({
    reduxAsyncConnect,
    router: routerReducer,
    customer: customerReducer,
    task: taskReducer
}, window.__data)

export const epic = combineEpics(
)
