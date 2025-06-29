<script setup lang="ts">
import Chat from './components/Chat.vue'
import TitleBar from './components/TitleBar.vue'
</script>

<template>
  <TitleBar />
  <div class="main">
    <Chat />
  </div>
</template>

<style scoped>
  .main {
    overflow-y: auto;
    height: 100vh;
  }
</style>
