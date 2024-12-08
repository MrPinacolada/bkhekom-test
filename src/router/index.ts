import { createRouter, createWebHistory } from "vue-router";
import tableView from "@/views/table/index.vue";
import noteView from "@/views/todo/[id].vue";
import { NotesService } from "@/services/notes";

const noteService = new NotesService();
const hydrateProps = (route, props) => {
  Object.assign(route.meta, { props });
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      props: (route) => ({
        note: route.meta.props?.note,
      }),
    },
  ],
});

export default router;
