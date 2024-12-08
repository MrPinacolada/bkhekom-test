import { createRouter, createWebHistory } from "vue-router";
import tableView from "@/views/table/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/table",
    },
    {
      path: "/table",
      name: "home",
      component: tableView,
    },
  ],
});

export default router;
