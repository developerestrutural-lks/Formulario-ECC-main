import {createApp} from "vue";
import {
    createRouter,
    createWebHashHistory,
} from "vue-router";

import App from "./App.vue";
import Home from "./views/Home.vue";
import Form from "./views/Form.vue";
import EndScreen from "./views/EndScreen.vue";
import VueTheMask from 'vue-the-mask';

const routes = [
    {path: "/", component: Home},
    {path: "/form", component: Form},
    {path: "/end", component: EndScreen},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const formularioFinalizado = localStorage.getItem('formularioFinalizado') === 'true';

    if (to.path === '/form' && formularioFinalizado) {
        next('/end');
    } else {
        next();
    }
});

// const pinia = createPinia()
// pinia.use(piniaPersistedstate)

console.log("Vue is starting...");
console.log("Iniciando Questionário");

const app = createApp(App);
app.use(router);
app.use(VueTheMask);
app.mount("#app");
