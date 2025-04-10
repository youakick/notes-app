<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay">
    <div class="dialog" role="dialog" aria-modal="true">
      <button class="dialog-close" @click="close">✕</button>

      <div v-if="$slots.top" class="dialog-header">
        <slot name="top" />
      </div>

      <div class="dialog-body">
        <slot />
      </div>

      <div v-if="$slots.bottom" class="dialog-footer">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.dialog {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.dialog-header {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn:hover {
  background-color: #45a049;
}
</style>
