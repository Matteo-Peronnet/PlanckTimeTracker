import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { connectRouter } from 'connected-react-router'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as planckReducer, epic as planckEpic } from './planck'
import { reducer as userReducer, epic as userEpic } from './user'
import { reducer as intlReducer } from './intl'
import { reducer as timerReducer, epic as timerEpic} from './timer'

export default (history) =>  combineReducers({
    reduxAsyncConnect,
    router: connectRouter(history),
    planck: planckReducer,
    user: userReducer,
    intl: intlReducer,
    timer: timerReducer
}, window.__data)

export const epic = combineEpics(
    userEpic,
    timerEpic,
    planckEpic
)
