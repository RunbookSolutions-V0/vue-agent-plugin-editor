import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Wind from './presets/wind'

import "./styles.css"
import 'primeicons/primeicons.css'

import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
    unstyled: true,
    pt: Wind
})

app.mount('#app')
