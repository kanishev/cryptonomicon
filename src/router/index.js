import { createRouter, createWebHistory } from "vue-router";
import App from '../App.vue';


const routes = [
  { path: "/", component: App },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  routes,
});


export default router;