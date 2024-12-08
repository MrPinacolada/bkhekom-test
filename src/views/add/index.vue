<template>
  <div class="note-add">
    <div class="note-add__header">
      <h1 class="note-add__title">Создать заметку</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="note-add__form">
      <div class="note-add__form-group">
        <label for="title" class="note-add__label">Название</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="note-add__input"
          placeholder="Введите название"
          :class="{ 'note-add__input--error': errors.title }"
        />
        <span v-if="errors.title" class="note-add__error-message">
          {{ errors.title }}
        </span>
      </div>

      <div class="note-add__form-group note-add__checkbox">
        <input
          id="completed"
          v-model="completed"
          type="checkbox"
          class="note-add__checkbox-input"
        />
        <label for="completed" class="note-add__checkbox-label">
          Заметка выполнена
        </label>
      </div>

      <button type="submit" class="note-add__button">Сохранить</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { noteService, type Note } from "@/services/notes";

const router = useRouter();

const title = ref("");
const completed = ref(false);

const errors = ref<{ title?: string }>({});

const handleSubmit = () => {
  errors.value = {};

  if (!title.value.trim()) {
    errors.value.title = "Название обязательно для заполнения";
    return;
  } else if (title.value.length < 3 || title.value.length > 50) {
    errors.value.title = "Название должно содержать от 3 до 50 символов";
    return;
  }

  const newNote: Omit<Note, "id"> = {
    userId: 1, // Заглушка
    title: title.value,
    body: "",
    completed: completed.value,
  };

  noteService.addNote(newNote);
  router.push("/table");
};
</script>

<style scoped lang="scss">
.note-add {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &__header {
    margin-bottom: 20px;
    text-align: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__label {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
  }

  &__input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      border-color: #007bff;
      outline: none;
    }

    &--error {
      border-color: #dc3545;
    }
  }

  &__error-message {
    font-size: 0.875rem;
    color: #dc3545;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 10px;

    &-label {
      font-size: 1rem;
      color: #333;
    }

    &-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  &__button {
    padding: 10px 20px;
    background-color: #28a745;
    color: #fff;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #218838;
    }
  }
}
</style>
