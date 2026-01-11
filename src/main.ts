import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize auth listener
const userStore = useUserStore()
userStore.initAuthListener()

app.mount('#app')
// Force rebuild dom 11 ene 2026 02:49:37 CST
