<!-- tabbar -->
<script setup lang="ts">
    import logo from '../assets/logo-32.png';
    import { ref } from 'vue'
    const isMaximized = ref(false)

    const handleMinimize = () => {
      window.electronAPI.minimize()
    }

    const toggleMaximize = () => {
        window.electronAPI.toggleMaximize()
        isMaximized.value = !isMaximized.value
    }
    const close = () => {
          window.electronAPI.close()
    }
</script>

<template>
  <div class="title-bar">
    <McHeader class="logo" :logoImg="logo">
    </McHeader>
    <div class="controls">
        <button @click="handleMinimize" title="最小化" id="min-btn">－</button>
        <button @click="toggleMaximize" title="最大化" id="max-btn">{{ isMaximized ? '❐' : '□' }}</button>
        <button @click="close" title="关闭" id="close-btn">×</button>
    </div>
    </div>
</template>

<style scoped>
/* 关键样式 */
.title-bar {
  -webkit-app-region: drag; /* 允许拖拽区域:ml-citation{ref="3,5" data="citationList"} */
  height: 42px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
    padding-left: 20px;
  }

.logo {
  margin-left: 20px;
}
.controls button {
  -webkit-app-region: no-drag; /* 禁止按钮拖拽:ml-citation{ref="3" data="citationList"} */
  border: none;
  cursor: auto;
  border-radius: 0;
  width: 50px;
  background: #fff;
  color: #000;
}

.controls button:hover {
  border: none;
}

.controls #close-btn:hover{
    background-color: red;
    color: #fff;
}

.controls #min-btn:hover, .controls #max-btn:hover{
    background-color: #f1efef;
}

.controls button:focus, .controls button:focus-visible{
  outline: none;
}

</style>

<style>
  .title-bar .logo .mc-header-logo {
    width: 66%;
  }
</style>