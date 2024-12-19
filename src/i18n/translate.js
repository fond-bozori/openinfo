import { ru } from './langs/ru.json'
import { en } from './langs/en.json'
import { uz } from './langs/uz.json'
import { createI18n } from 'vue-i18n'

export const messages = {
  en: { message: en },
  ru: { message: ru },
  uz: { message: uz },
}

export const i18n = createI18n({
  legacy: false,
  debug: true,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages,
})

import { localeMapping } from './localeMapping.js'

export function changeGoogleTranslateLanguage(locale) {
  const googleTranslateLocale = localeMapping[locale]
  console.log(googleTranslateLocale, 'sss')
  if (googleTranslateLocale) {
    const iframe = document.querySelector('iframe.goog-te-banner-frame')
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      const languageSelect = iframeDoc.querySelector('.goog-te-combo')
      if (languageSelect) {
        languageSelect.value = googleTranslateLocale
        languageSelect.dispatchEvent(new Event('change'))
      }
    }
  }
}
