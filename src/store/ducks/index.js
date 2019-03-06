import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { connectRouter } from 'connected-react-router'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as planckReducer } from './planck'
import { reducer as userReducer, epic as userEpic } from './user'


export default (history) =>  combineReducers({
    reduxAsyncConnect,
    router: connectRouter(history),
    planck: planckReducer,
    user: userReducer,
}, window.__data)

export const epic = combineEpics(
    userEpic
)
