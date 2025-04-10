<script setup lang="ts">
import { useRoute } from "vue-router";
import { homeIcon } from "../assets";
import { computed } from "vue";
const route = useRoute();
const isHomePage = computed(() => route.path === "/");
</script>

<template>
  <div class="layout">
    <header>
      <h1>Welcome to notes application</h1>
      <router-link v-if="!isHomePage" to="/" class="home-link">
        <img
          class="home"
          :src="homeIcon"
          alt="home"
          title="Back to home page"
        />
      </router-link>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>&copy; 2025 V.M. All rights reserved 2025</footer>
  </div>
</template>

<style scoped>
header,
footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: limegreen;
  color: white;
  font-size: 24px;
  padding: 5px;
}

main {
  flex: 1;
}
.home {
  cursor: pointer;
  height: 35px;
  padding: 2px;
}
.home-link {
  border-radius: 8px;
  border: 2px solid #6528b4;
  transition: all 0.2s ease;
  background-color: limegreen;
  margin-left: 10px;
}
.home-link:hover {
  background: #6528b4;
}
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
