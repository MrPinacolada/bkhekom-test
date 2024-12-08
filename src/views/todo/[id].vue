<template>
  <div class="note-detail">
    <div class="note-detail__header">
      <h1 class="note-detail__title">{{ note.title }}</h1>
    </div>

    <div class="note-detail__status">
      <span class="note-detail__status-label">Статус:</span>
      <span
        :class="[
          'note-detail__status-value',
          {
            'note-detail__status-value--completed': isCompleted,
            'note-detail__status-value--not-completed': !isCompleted,
          },
        ]"
      >
        {{ isCompleted ? "Выполнено" : "Не выполнено" }}
      </span>
    </div>

    <div class="note-detail__footer">
      <router-link to="/table" class="note-detail__back-button"
        >Вернуться назад</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import { type Note } from "@/services/notes";

interface IProps {
  note: Note;
}

const props = defineProps<IProps>();
const note = computed(() => props.note);

const completedStates = JSON.parse(
  localStorage.getItem("completedStates") || "{}"
);
const isCompleted = ref(completedStates[note.value.id] || note.value.completed);
</script>

<style scoped lang="scss">
.note-detail {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  font-family: "Roboto", sans-serif;
  color: #333;

  &__header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #ddd;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: #444;
    margin: 0;
  }

  &__status {
    margin: 25px 0;
    font-size: 1.2rem;

    &-label {
      font-size: 1.2rem;
      font-weight: 500;
      color: #666;
    }

    &-value {
      font-size: 1.2rem;
      font-weight: 600;
      margin-left: 10px;
      transition: color 0.3s ease-in-out;

      &--completed {
        color: #28a745; 
      }

      &--not-completed {
        color: #dc3545; 
      }
    }
  }

  &__footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
  }

  &__back-button {
    padding: 12px 24px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);

    &:hover {
      background-color: #0056b3;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.3);
    }
  }
}
</style>
