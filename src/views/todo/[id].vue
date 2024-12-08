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
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  &__header {
    margin-bottom: 20px;
  }
  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  &__status {
    margin-bottom: 20px;
  }
  &__footer {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
  &__status {
    &-label {
      font-size: 1.1rem;
      font-weight: 500;
    }
    &-value {
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: 10px;
      &--completed {
        color: #28a745;
      }
      &--not-completed {
        color: #dc3545;
      }
    }
  }
  &__back-button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s;
    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
