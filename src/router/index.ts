import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NoteView from "@/views/NoteView.vue";
import MainView from "@/views/MainView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MainView,
  },
  {
    path: "/:title",
    name: "note",
    component: NoteView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
