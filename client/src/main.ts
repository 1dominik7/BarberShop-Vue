import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'leaflet/dist/leaflet.css';
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'swiper/css';

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.component('VueDatePicker', VueDatePicker)
app.use(router)
app.use(MotionPlugin)
app.use(pinia)

app.mount('#app')
