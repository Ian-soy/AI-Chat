<template>
  <div :class="{'container-cls': !isElectronEnv()}">
    <TitleBar v-if="isElectronEnv()" />
    <SideBar v-else @newConversation="handleConversation" />
    <div :class="{'main-cls': !isElectronEnv(), 'main': isElectronEnv()}">
      <Chat ref="chatRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Chat from './components/Chat.vue'
import TitleBar from './components/TitleBar.vue'
import SideBar from './components/SideBar.vue'

import { isElectronEnv } from './utils/env.ts'
const chatRef = ref(null)

const handleConversation = () => {
  nextTick(() => {
    const chatDom = chatRef?.value as any
    chatDom.newConversation()
  })
  
}

</script>

<style scoped>
  .main {
    overflow-y: auto;
    height: 100vh;
  }

  .container-cls {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-image: url('./assets/global-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 8px 8px 8px 0;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
  }

  .main-cls {
    flex: 1;
    height: 100%;
    padding: 0 20px;
    background: #fff;
    margin: 0 auto;
    border-radius: 16px;
    display: flex;
    color: #252b3a;
  }
</style>
