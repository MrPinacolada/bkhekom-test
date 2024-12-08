<script setup lang="ts">
import { defineProps } from "vue";
import { type Note } from "@/services/notes";

interface IProps {
  note: Note;
}

const props = defineProps<IProps>();

console.log(props.note);
</script>

<template>
  <div class="note-details">
    <h2>{{ note.title }}</h2>
  </div>
</template>
