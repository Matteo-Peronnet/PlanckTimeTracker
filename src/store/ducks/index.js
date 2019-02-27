import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { routerReducer } from 'react-router-redux'

export const reducer = combineReducers({
    router: routerReducer,
})

export const epic = combineEpics(
)
