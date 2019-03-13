import { isObservable } from "rxjs";

export default function reduxCasesMiddleware() {
    return ({ dispatch, getState }) => {
        return next =>  action => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }

            if(isObservable(action)){
                return action(dispatch, getState);
            }

            const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
            if (!promise) {
                return next(action);
            }
            const [REQUEST, SUCCESS, FAILURE, END] = types;
            next({ ...rest, type: REQUEST });
            return promise(getState, dispatch)
                .then(
                    result => next({ ...rest, result, type: SUCCESS }),
                    error => next({ ...rest, error, type: FAILURE })
                )
                .catch(error => {
                    console.error('MIDDLEWARE ERROR:', error);
                    next({ ...rest, error, type: FAILURE });
                })
                .finally(() =>
                    next({type: END})
                );
        };
    };
}
