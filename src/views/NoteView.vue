<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import TodoActionsModal from "@/components/TodoActionsModal.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "@/store/notesStore";
import { TodoSection, TodoSectionListItem } from "@/types/note-types";
import { editIcon, deleteIcon } from "../assets";
import { computed, Ref, ref } from "vue";
import {
  saveLocalNoteToStorage,
  loadLocalNoteFromStorage,
  removeLocalNoteFromStorage,
} from "@/utils/localStorageActions";

const notesStore = useNotesStore();
const route = useRoute();
const router = useRouter();
const noteTitle = route.params.title as string;

const previousStack = ref<TodoSectionListItem[][]>([]);
const nextStack = ref<TodoSectionListItem[][]>([]);

const todoText = ref<string>("");
const selectedTodo = ref<string>("");
const showDialog = ref<boolean>(false);
const localNote = ref<TodoSection | null>(null);
const savedNote = ref<TodoSectionListItem[] | null>(null);
const isSaveAction = ref<boolean>(false);

//стэйты для окна подтверждения действия
const isConfirmOpen = ref<boolean>(false);
const confirmMessage = ref<string>("");
const confirmAction = ref<(() => void) | null>(null);

// фун-и для подтверждения действия
const openConfirmation = (message: string, action: () => void) => {
  confirmMessage.value = message;
  confirmAction.value = action;
  isConfirmOpen.value = true;
  isSaveAction.value = false;
};

const showSuccessSaveDialog = (message: string) => {
  confirmMessage.value = message;
  confirmAction.value = null;
  isConfirmOpen.value = true;
  isSaveAction.value = true;
};

const handleConfirm = () => {
  confirmAction.value?.();
  isConfirmOpen.value = false;
};

const originalNote = computed(() =>
  notesStore.todoList.find(
    (item: TodoSection) => item.title.toLowerCase() === noteTitle.toLowerCase()
  )
);

const handleAddNewTodo = () => {
  selectedTodo.value = "";
  todoText.value = "";
  showDialog.value = true;
};

//  подтягивает драфт если есть, если нету, берем из стора
if (originalNote.value) {
  const savedDraft = loadLocalNoteFromStorage(originalNote.value.title);
  localNote.value = savedDraft
    ? JSON.parse(JSON.stringify(savedDraft))
    : JSON.parse(JSON.stringify(originalNote.value));

  savedNote.value = JSON.parse(JSON.stringify(originalNote.value.list));
}
// функционал для возвращения и отката изменений
const pushToPreviousStack = () => {
  if (!localNote.value) return;
  previousStack.value.push(JSON.parse(JSON.stringify(localNote.value.list)));
  nextStack.value = [];
};

const applyHistoryStep = (
  fromStack: Ref<TodoSectionListItem[][]>,
  toStack: Ref<TodoSectionListItem[][]>
) => {
  if (!localNote.value || fromStack.value.length === 0) return;
  toStack.value.push(JSON.parse(JSON.stringify(localNote.value.list)));
  const state = fromStack.value.pop();
  if (state) {
    localNote.value.list = JSON.parse(JSON.stringify(state));
    saveLocalNoteToStorage(localNote.value);
  }
};

const handlePrevious = () => {
  applyHistoryStep(previousStack, nextStack);
};

const handleNext = () => {
  applyHistoryStep(nextStack, previousStack);
};
// обработка логики изменений тудушек
const handleTodoAdd = () => {
  if (localNote.value && todoText.value.trim()) {
    pushToPreviousStack();
    localNote.value.list.push({ todo: todoText.value.trim(), status: false });
    saveLocalNoteToStorage(localNote.value);
    closeDialog();
  }
};

const handleEdit = (todo: string) => {
  selectedTodo.value = todo;
  todoText.value = todo;
  showDialog.value = true;
};

const submitTodoEdits = () => {
  if (!localNote.value) return;
  const item = localNote.value.list.find((t) => t.todo === selectedTodo.value);
  if (item && todoText.value.trim() && todoText.value !== selectedTodo.value) {
    pushToPreviousStack();
    item.todo = todoText.value.trim();
    saveLocalNoteToStorage(localNote.value);
  }
  selectedTodo.value = "";
  closeDialog();
};

const handleDelete = (todo: string) => {
  openConfirmation(`Delete todo - ${todo}?`, () => {
    if (!localNote.value) return;
    pushToPreviousStack();
    localNote.value.list = localNote.value.list.filter((t) => t.todo !== todo);
    saveLocalNoteToStorage(localNote.value);
  });
};

const handleCheckboxChange = (todoTitle: string, newStatus: boolean) => {
  if (!localNote.value) return;
  const todo = localNote.value.list.find((t) => t.todo === todoTitle);
  if (todo) {
    pushToPreviousStack();
    todo.status = newStatus;
    saveLocalNoteToStorage(localNote.value);
  }
};

const saveChanges = () => {
  if (!localNote.value) return;
  notesStore.editNote(localNote.value.title, localNote.value.list);
  removeLocalNoteFromStorage(localNote.value.title);
  showSuccessSaveDialog("Changes saved successfully!");

  savedNote.value = JSON.parse(JSON.stringify(localNote.value.list));
};

const cancelEditing = () => {
  if (originalNote.value) {
    localNote.value = JSON.parse(JSON.stringify(originalNote.value));
    removeLocalNoteFromStorage(originalNote.value.title);
  }
};

const handleNoteDelete = (title: string) => {
  openConfirmation(`Delete note - ${title}?`, () => {
    notesStore.deleteNote(title);
    removeLocalNoteFromStorage(title);
    router.push("/");
  });
};

const closeDialog = () => {
  todoText.value = "";
  showDialog.value = false;
};

const hasChanges = computed(() => {
  if (!localNote.value || !savedNote.value) return false;
  return (
    JSON.stringify(localNote.value.list) !== JSON.stringify(savedNote.value)
  );
});
</script>

<template>
  <MainLayout>
    <div v-if="localNote" class="wrapper">
      <div class="title-container">
        <h1 class="title">{{ localNote.title }}:</h1>
        <button class="btn" @click="handleAddNewTodo">+</button>
      </div>
      <div class="note-item">
        <div
          class="note-item-container"
          v-for="(todo, index) in localNote.list"
          :key="index"
        >
          <input
            class="note-item-checkbox"
            type="checkbox"
            :id="todo.todo"
            :name="todo.todo"
            :checked="todo.status"
            @change="handleCheckboxChange(todo.todo, !todo.status)"
          />
          <label class="note-item-title" :for="todo.todo">{{
            todo.todo
          }}</label>
          <div class="note-item-icons">
            <button class="note-item-button" @click="handleEdit(todo.todo)">
              <img
                :src="editIcon"
                alt="edit"
                title="edit"
                class="note-item-button-icon"
              />
            </button>
            <button class="note-item-button" @click="handleDelete(todo.todo)">
              <img
                :src="deleteIcon"
                alt="delete"
                title="delete"
                class="note-item-button-icon"
              />
            </button>
          </div>
        </div>
      </div>
      <div class="note-buttons">
        <button class="btn" @click="saveChanges" :disabled="!hasChanges">
          Save
        </button>
        <button class="btn" @click="cancelEditing" :disabled="!hasChanges">
          Cancel changes
        </button>
        <button class="btn" @click="handleNoteDelete(localNote.title)">
          Delete
        </button>
        <button
          class="btn"
          @click="handlePrevious"
          :disabled="previousStack.length === 0"
        >
          Cancel last change
        </button>
        <button
          class="btn"
          @click="handleNext"
          :disabled="nextStack.length === 0"
        >
          Return last change
        </button>
      </div>
    </div>
    <TodoActionsModal :isOpen="showDialog" @close="closeDialog">
      <template #top>
        {{ selectedTodo ? "Edit todo" : "Add new todo" }}
      </template>

      <input type="text" v-model="todoText" class="base-dialog-input" />

      <template #bottom>
        <button
          class="btn"
          @click="selectedTodo ? submitTodoEdits() : handleTodoAdd()"
        >
          Confirm
        </button>
        <button class="btn btn--cancel" @click="closeDialog">Cancel</button>
      </template>
    </TodoActionsModal>
    <ConfirmationDialog
      :isOpen="isConfirmOpen"
      :message="confirmMessage"
      :isSaveAction="isSaveAction"
      @confirm="handleConfirm"
      @close="isConfirmOpen = false"
    />
  </MainLayout>
</template>

<style scoped>
.note-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  gap: 10px;
  margin-bottom: 10px;
}
.note-item-container {
  display: flex;
  align-items: center;
  border: 2px solid #4caf50;
  border-radius: 8px;
  padding: 10px;
  transition: box-shadow 0.7s ease;
}
.note-item-container:hover {
  box-shadow: 0 0 10px 5px rgba(101, 40, 180, 0.5);
}
.note-item-title {
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 5px;
}
.note-item-checkbox {
  cursor: pointer;
}
.note-item-icons {
  display: flex;
  gap: 5px;
}
.note-item-button {
  height: 30px;
  cursor: pointer;
  border-radius: 5px;
  padding: 2px;
}
.note-item-button:hover {
  background-color: #4caf50;
}
.note-item-button-icon {
  height: 100%;
}
.note-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transition: opacity 0.2s ease;
}
.btn:disabled:hover {
  background-color: #6528b4;
}
.base-dialog-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
