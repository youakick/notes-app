<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { useNotesStore } from "@/store/notesStore";
import { TodoSection } from "@/types/note-types";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);
const notesStore = useNotesStore();

const title = ref<string>("");
const todoText = ref<string>("");
const todosList = ref<string[]>([]);

function submitForm() {
  const note: TodoSection = {
    title: title.value.trim(),
    list: todosList.value.map((todo) => ({ todo, status: false })),
  };

  notesStore.addNote(note);

  title.value = "";
  todosList.value = [];
  emit("close");
}

function addTodo() {
  if (todoText.value.trim()) {
    todosList.value.push(todoText.value.trim());
    todoText.value = "";
  }
}

function close() {
  title.value = "";
  todoText.value = "";
  todosList.value = [];
  emit("close");
}
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay">
    <div class="dialog-box">
      <h2>Add note</h2>
      <form @submit.prevent="submitForm">
        <div class="dialog-container">
          <label>Title:</label>
          <input v-model="title" required />

          <label>Todo Items:</label>
          <input v-model="todoText" placeholder="Enter a todo item" />
          <button type="button" class="btn add-todo-btn" @click="addTodo">
            Add Todo
          </button>
        </div>

        <div v-if="todosList.length > 0" class="todo-list">
          <ul>
            <li v-for="(todo, index) in todosList" :key="index">{{ todo }}</li>
          </ul>
        </div>

        <div class="buttons">
          <button class="btn" type="submit">Add Note</button>
          <button class="btn" type="button" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-box {
  background: white;
  padding: 15px;
  border-radius: 12px;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  height: 420px;
  overflow: hidden;
}
label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
form {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.add-todo-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}
.add-todo-btn:hover {
  background-color: #45a049;
}
.todo-list {
  max-height: 95px;
  height: 100%;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 10px;
}
.todo-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.todo-list li {
  background-color: #f4f4f4;
  padding: 8px;
  margin: 5px 0;
  border-radius: 6px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn:hover {
  background-color: #4caf50;
  color: white;
}
</style>
