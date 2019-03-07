import { locale, messages } from '../../i18n'
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
    store.set('locale', lang)
};
