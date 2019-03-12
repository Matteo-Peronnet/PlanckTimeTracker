import { IntlProvider, addLocaleData } from 'react-intl'
import Store from 'electron-store';
import { updateIntl } from 'react-intl-redux'
import frLocaleData from 'react-intl/locale-data/fr'
import enLocaleData from 'react-intl/locale-data/en'
import dotize from 'dotize'
import fr from './fr.yaml'
import en from './en.yaml'

export const storage = new Store();

const fallback = 'fr'
const availables = [
    'fr',
    'en',
]

const current = storage.get('locale')

export const locale = availables.includes(current) ? current : fallback
export const messages = {
    fr: dotize.convert(fr),
    en: dotize.convert(en),
}

storage.set('locale', locale);

addLocaleData([
    ...frLocaleData,
    ...enLocaleData,
])

updateIntl({ locale, messages: messages[locale] })

const provider = new IntlProvider({ locale: locale, messages: messages[locale] }, {}).getChildContext()
export const intl = provider.intl
