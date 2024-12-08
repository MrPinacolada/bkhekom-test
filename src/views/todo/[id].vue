<script setup lang="ts">
import { computed, defineProps, watchEffect } from "vue";
import { type Note } from "@/services/notes";

interface IProps {
  note: Note;
}

const props = defineProps<IProps>();

const note = computed(()=>props.note)

watchEffect(() => {
  console.log('Note has changed:', note.value); // Логируем изменения note
});
</script>

<template>
  <div class="note-details">
    {{ note }}
  </div>
</template>
