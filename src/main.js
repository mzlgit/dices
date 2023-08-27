import './style/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import animate from 'animate.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(animate)

app.mount('#app')
