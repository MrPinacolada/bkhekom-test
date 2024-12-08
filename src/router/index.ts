import { createRouter, createWebHashHistory } from "vue-router";
import tableView from "@/views/table/index.vue";
import noteView from "@/views/todo/[id].vue";
import { noteService } from "@/services/notes";
import addNote from "@/views/add/index.vue";

const hydrateProps = (route: any, props: any) => {
  Object.assign(route.meta, { props });
};
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/table",
    },
    {
      path: "/table",
      name: "table",
      component: tableView,
    },
    {
      path: "/add",
      name: "addNote",
      component: addNote,
    },
    {
      path: "/todo/:id",
      name: "note",
      component: noteView,
      async beforeEnter(to, from, next) {
        const noteId = to.params.id as string;
        const formattedId = noteId.replace(/-/g, " ");
        const note = await noteService.getNoteByTitle(formattedId);
        hydrateProps(to, { note });
        next();
      },
      props: (route: any) => ({
        note: route.meta.props?.note,
      }),
    },
  ],
});

export default router;
