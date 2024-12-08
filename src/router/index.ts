import { createRouter, createWebHistory } from "vue-router";
import tableView from "@/views/table/index.vue";
import noteView from "@/views/todo/[id].vue";
import { NotesService } from "@/services/notes";

const noteService = new NotesService();
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
      props: async (route) => {
        const noteId = route.params.id as string;
        const formattedId = noteId.replace(/-/g, " ");
        try {
          const note = await noteService.getNoteByTitle(formattedId);
          return { note };
        } catch (error) {
          console.error("Ошибка при получении заметки:", error);
          return { note: null };
        }
      },
    },
  ],
});

export default router;
