<script setup lang="ts">
import { TodoSection } from "@/types/note-types";
import { defineProps, ref } from "vue";
import { useNotesStore } from "@/store/notesStore";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

defineProps<{
  note: TodoSection;
}>();

const notesStore = useNotesStore();

const isDialogOpen = ref(false);
const message = ref("");
const actionType = ref("");
const noteTitle = ref("");

const handleDelete = (title: string) => {
  message.value = `Delete note - ${title}?`;
  actionType.value = "delete";
  noteTitle.value = title;
  isDialogOpen.value = true;
};

const confirmAction = (action: string) => {
  if (action === "delete") {
    notesStore.deleteNote(noteTitle.value);
  }
  isDialogOpen.value = false;
};

const closeDialog = () => {
  isDialogOpen.value = false;
};
</script>

<template>
  <div>
    <h2 class="note-title">{{ note.title }}</h2>
    <ul class="note-list">
      <li
        v-for="(item, index) in note.list.slice(0, 3)"
        :key="index"
        class="note-list-item"
      >
        <input
          class="note-item-checkbox"
          type="checkbox"
          :checked="item.status"
        />
        <p class="note-list-label">{{ item.todo }}</p>
      </li>
      <router-link
        class="note-list-label link"
        :to="`${note.title.toLowerCase()}`"
        >Click to see all...</router-link
      >
    </ul>
  </div>
  <div class="buttons-container">
    <router-link :to="`${note.title.toLowerCase()}`" class="btn-link"
      ><button class="btn">Edit note</button></router-link
    >
    <button class="btn" @click="handleDelete(note.title)">Delete note</button>
  </div>
  <ConfirmationDialog
    :isOpen="isDialogOpen"
    :message="message"
    :action="actionType"
    @confirm="confirmAction"
    @close="closeDialog"
  />
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}
.note-list-label {
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;

  font-size: 18px;
}
.link:hover {
  cursor: pointer;
  color: #6528b4;
}
.note-list-item {
  display: flex;
}
.note-item-checkbox {
  margin-right: 5px;
  pointer-events: none;
}
.btn-link {
  width: 140px;
}
</style>
