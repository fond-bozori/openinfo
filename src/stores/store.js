// store.js
import { defineStore } from 'pinia'

export const useStore = defineStore('', {
  state: () => ({
    searchQuery: '',
    currentLanguage: 'ru', // Default language
    i18n: null,
    currentPage: 1,
    reportType: 'main',
    nameSuffix: null,
    companyInn: null,
    isinCodeSimple: null,
    isinCodePrivileged: null,
    name_test_taker: '',
    test_language: 'ru',
  }),
  actions: {
    setActiveLanguage(lang) {
      this.currentLanguage = lang
    },
    setTestTaker(name) {
      this.name_test_taker = name
    },
    setTestLanguage(lang) {
      this.test_language = lang
    },
    setCurrentSuffix(suffix) {
      this.nameSuffix = suffix
    },
    setInn(inn) {
      this.companyInn = inn
    },
    setSimpleIsin(code) {
      this.isinCodeSimple = code
    },
    setPrivilegedIsin(code) {
      this.isinCodePrivileged = code
    },
  },
})
