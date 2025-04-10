<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import NoteCard from "@/components/NoteCard.vue";
import AddNoteModal from "@/components/AddNoteModal.vue";
import { ref } from "vue";
import { useNotesStore } from "@/store/notesStore";
import { LOCAL_NOTE_KEY } from "@/utils/localStorageActions";

const notesStore = useNotesStore();
const todoList = notesStore.todoList;
const showDialog = ref<boolean>(false);
function cleanStorage() {
  localStorage.removeItem(LOCAL_NOTE_KEY);
}
cleanStorage();
</script>

<template>
  <MainLayout>
    <div class="wrapper">
      <div class="title-container">
        <h1 class="title">Your to do list:</h1>
        <button class="btn" @click="showDialog = true">Add note</button>
      </div>
      <div class="note">
        <div
          class="note-container"
          v-for="(note, index) in todoList"
          :key="index"
        >
          <NoteCard :note="note" />
        </div>
      </div>
      <AddNoteModal :isOpen="showDialog" @close="showDialog = false" />
    </div>
  </MainLayout>
</template>

<style lang="scss">
.note-list {
  list-style: none;
}
.title {
  text-align: center;
  color: #6528b4;
}
.note {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 10px;
  justify-content: flex-start;
}
.note-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  border: 1px solid #4caf50;
  border-radius: 12px;
  padding: 10px;
}
.note-title {
  text-align: center;
  color: #6528b4;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.btn {
  max-width: 140px;
  width: 100%;
  text-align: center;
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid #6528b4;
  background-color: #6528b4;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn:hover {
  background-color: #4caf50;
}
.title-container {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.note-container {
  transition: box-shadow 0.7s ease;
  background-color: limegreen;
}
.note-container:hover {
  box-shadow: 0 0 10px 5px rgba(101, 40, 180, 0.5);
}
</style>
