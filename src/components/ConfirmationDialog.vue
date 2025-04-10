<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  message: string;
  isOpen: boolean;
  action?: string;
  isSaveAction?: boolean;
}>();

const emit = defineEmits(["confirm", "close"]);

function confirmAction() {
  emit("confirm", props.action);
}

function closeDialog() {
  emit("close");
}
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay">
    <div class="dialog-box">
      <h3>{{ message }}</h3>

      <div class="buttons">
        <button v-if="!isSaveAction" class="btn" @click="confirmAction">
          Yes
        </button>
        <button v-if="!isSaveAction" class="btn" @click="closeDialog">
          No
        </button>
        <button v-if="isSaveAction" class="btn" @click="closeDialog">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-height: 80vh;
  max-width: 90vw;
  overflow-y: auto;
  text-align: center;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 20px;
}
.btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background-color: #45a049;
}
</style>
