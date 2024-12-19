import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n/translate'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/main.css'
import moment from 'moment'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(moment)
app.use(ElementPlus)
app.mount('#app')
