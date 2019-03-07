import { locale, messages } from '../../i18n'
import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {NEVER, of} from "rxjs";
import { updateIntl } from 'react-intl-redux'
import { store } from '../../i18n/index'
const INTL_UPDATE = "@@intl/UPDATE"

// Reducer
const INITIAL_STATE = {
    locale: locale,
    messages: messages[locale],
}

export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case INTL_UPDATE: {
            return {
                ...state,
                locale: action.payload.locale,
                messages: action.payload.messages
            }
        }
        default:
            return state
    }
}

export const updateIntlRequest = lang => dispatch => {
    dispatch(
        updateIntl({
            locale: lang,
            messages: messages[lang],
        })
    )
};

export const epic = combineEpics(
    updateIntlEpic
)


export function updateIntlEpic(action$, state$) {
    return action$.pipe(
        ofType(INTL_UPDATE),
        mergeMap(() => {
            store.set('locale', state$.value.intl.locale)
            return NEVER
        }),
    )
}
