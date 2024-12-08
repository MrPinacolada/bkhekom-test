<template>
  <div class="notes">
    <h1 class="notes__title">Список заметок</h1>
    <div class="notes__table-container">
      <table class="notes__table">
        <thead class="notes__table-head">
          <tr class="notes__table-row">
            <th class="notes__table-header">#</th>
            <th class="notes__table-header">Название</th>
            <th
              :class="[
                'notes__table-header',
                'notes__filter',
                { 'notes__filter--picked': filterCompleted },
              ]"
              @click="filterByComplited"
            >
              Отметка о выполнении
            </th>
            <th class="notes__table-header">Действия</th>
          </tr>
        </thead>
        <tbody class="notes__table-body">
          <tr
            v-for="(note, index) in filteredNotes"
            :key="note.id"
            :class="[
              'notes__table-row',
              { 'notes__table-row--completed': note.completed },
            ]"
          >
            <td class="notes__table-data">{{ index + 1 }}</td>
            <td class="notes__table-data">
              <router-link
                :to="`/todo/${slugify(note.title)}`"
                class="notes__link"
              >
                {{ note.title }}
              </router-link>
            </td>
            <td class="notes__table-data">
              <input
                type="checkbox"
                v-model="note.completed"
                class="notes__checkbox"
                @change="toggleCompleted(note)"
              />
            </td>
            <td class="notes__table-data">
              <div class="notes__actions">
                <button
                  @click="editNote(note)"
                  class="notes__button notes__button--edit"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteNote(note.id)"
                  class="notes__button notes__button--delete"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="tableLoader" class="notes__loader">Загрузка...</div>
    <div v-else-if="!filteredNotes.length" class="notes__empty">
      Заметок нет
    </div>
  </div>
  <popup-modal
    v-if="isPopupVisible"
    :title="popupTitle"
    :message="popupMessage"
    :type="popupType"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NotesService, type Note } from "@/services/notes";
import PopupModal from "@/components/PopupModal.vue";
import { useRoute, useRouter } from "vue-router";

const noteService = new NotesService();
const route = useRoute();
const router = useRouter();

const notes = computed(() => noteService.notes);
const filterCompleted = ref(false);
const tableLoader = ref(true);
const isPopupVisible = ref(false);
const popupTitle = ref("");
const popupMessage = ref("");
const popupType = ref<"confirm" | "prompt">("confirm");
const popupResolve = ref<(value: string | boolean) => void>();

const handleConfirm = (value: string | boolean) => {
  popupResolve.value?.(value);
  isPopupVisible.value = false;
};

const handleCancel = () => {
  popupResolve.value?.(false);
  isPopupVisible.value = false;
};

const showPopup = (
  title: string,
  message: string,
  type: "confirm" | "prompt"
) =>
  new Promise<string | boolean>((resolve) => {
    popupTitle.value = title;
    popupMessage.value = message;
    popupType.value = type;
    isPopupVisible.value = true;
    popupResolve.value = resolve;
  });

const filteredNotes = computed(() => {
  return filterCompleted.value
    ? notes.value.filter((note) => note.completed)
    : notes.value;
});

const slugify = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

const toggleCompleted = (note: Note) => {
  const completedStates: Record<string, boolean> = JSON.parse(
    localStorage.getItem("completedStates") || "{}"
  );
  completedStates[note.id] = Boolean(note.completed);
  Object.keys(completedStates).forEach((key) => {
    if (!completedStates[key]) {
      delete completedStates[key];
    }
  });
  localStorage.setItem("completedStates", JSON.stringify(completedStates));
  noteService.editNote(note.id, note);
};

const deleteNote = async (noteId: number) => {
  isPopupVisible.value = true;

  const confirmed = await showPopup(
    "Удаление заметки",
    "Вы уверены, что хотите удалить заметку?",
    "confirm"
  );
  if (confirmed) {
    noteService.deleteNote(noteId);
  }
};

const editNote = async (note: Note) => {
  const newTitle = await showPopup(
    "Редактирование заметки",
    "Введите новое название заметки:",
    "prompt"
  );
  if (newTitle && typeof newTitle === "string") {
    noteService.editNote(note.id, { ...note, title: newTitle });
  }
};

const filterByComplited = () => {
  filterCompleted.value = !filterCompleted.value;
  const query = { ...route.query, completed: filterCompleted.value.toString() };
  router.push({ query });
};

const checkComplited = () => {
  const storedCompletedStates = localStorage.getItem("completedStates");
  if (storedCompletedStates) {
    const parsedStates: Record<number, boolean> = JSON.parse(
      storedCompletedStates
    );
    notes.value.forEach((note) => {
      if (parsedStates[note.id] !== undefined) {
        note.completed = parsedStates[note.id];
      }
    });
  }
};

const initNotes = async () => {
  try {
    await noteService.fetchNotes();
    checkComplited();
  } catch (error) {
    console.error(error);
  } finally {
    tableLoader.value = false;
    const completedQuery = route.query.completed;
    if (completedQuery !== undefined) {
      filterCompleted.value = completedQuery === "true";
    }
  }
};

onMounted(() => {
  initNotes();
});
</script>

<style scoped lang="scss">
.notes {
  max-width: 900px;
  margin: 2rem auto;
  font-family: "Roboto", sans-serif;

  &__title {
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.8rem;
  }

  &__filter {
    cursor: pointer;
    &--picked {
      color: #28a745 !important;
    }
  }

  &__table-container {
    overflow-x: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;

    &-head {
      background-color: #f4f4f4;
    }

    &-header {
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      color: #555;
      border-bottom: 2px solid #ddd;
    }

    &-body {
      .notes__table-row {
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #f9f9f9;
        }

        &--completed {
          .notes__table-data {
            color: #888;
            background-color: #f0f8f0;
          }
          .notes__link {
            text-decoration: line-through;
          }
        }
      }
    }

    &-data {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;

      .notes__checkbox {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
  }

  &__link {
    text-decoration: none;
    color: #007bff;

    &:hover {
      text-decoration: underline;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__button {
    padding: 6px 12px;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &--edit {
      background-color: #ffc107;
      color: #fff;

      &:hover {
        background-color: #e0a800;
      }
    }

    &--delete {
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #c82333;
      }
    }
  }

  &__loader,
  &__empty {
    text-align: center;
    font-size: 1.2rem;
    color: #777;
    margin-top: 1.5rem;
  }
}
</style>
