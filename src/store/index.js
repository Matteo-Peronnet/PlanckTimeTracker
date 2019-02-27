import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware } from 'redux-observable'
import { routerMiddleware } from 'react-router-redux'
import reduxCasesMiddleware from './middleware/reduxCasesMiddleware'
import createHistory from 'history/createBrowserHistory'
import { reducer, epic } from './ducks'
import { initApp } from './ducks/app'
import {xhook} from 'xhook'
import hooks from './utils/hooks'

export const history = createHistory();

const epicMiddleware = createEpicMiddleware();

const middleware = composeWithDevTools(
    applyMiddleware(epicMiddleware),
    applyMiddleware(reduxCasesMiddleware()),
    applyMiddleware(routerMiddleware(history)),
)

// XHR request middlewares

if (hooks.before) {
    xhook.before((request) => hooks.before(request, store.getState()))
}

if (hooks.after) {
    xhook.after((response) => hooks.after(response, store.getState()))
}

const store = createStore(reducer, middleware)

store.dispatch(initApp())

epicMiddleware.run(epic)

export default store
