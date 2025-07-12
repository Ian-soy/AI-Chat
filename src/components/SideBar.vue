<!-- tabbar -->
<script setup lang="ts">
    const emit = defineEmits(['newConversation'])
    import logo from '../assets/logo-32.png';
    // import { ref } from 'vue'

    const newConversation = () => {
      emit('newConversation')
    }
</script>

<template>
  <div class="side-bar">
    <div class="side-bar-content">
      <div class="side-bar-logo">
        <img class="logo-cls" :src="logo" alt="logo">
        <div class="side-bar-logo-text">SpaceChat</div>
      </div>
      <div class="side-bar-search" @click="newConversation">
        <i class="icon icon-add"></i>
        <div class="side-bar-search-text">新对话</div>
      </div>
      <div class="side-bar-history">
        <i class="icon icon-history"></i>
        <div class="side-bar-search-text">记录</div>
      </div>
    </div>

    <div class="side-bar-footer">
      <!-- <div>CN</div> -->
       <el-tooltip
        class="download-cls"
        effect="dark"
        content="下载客户端"
        placement="right"
      >
        <a href="https://github.com/Ian-soy/AI-Chat/archive/refs/tags/v5.1.0.zip" class="side-bar-footer-item">
          
            <span>
              <i class="icon icon-download-2"></i>
            </span>
          
        </a>
      </el-tooltip>
      <div class="side-bar-footer-item"><i class="icon icon-setting"></i></div>
    </div>
  </div>
</template>

<style scoped>
/* 关键样式 */
.side-bar {
  height: 100%;
  overflow: hidden;
  color: #252b3a;
  display: flex;
  align-items: center;
  padding: 0 8px;
  text-align: center;
  justify-content: space-between;
  flex-direction: column;
  width: 72px;
  box-sizing: border-box;
}

.side-bar-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 0 8px;
    margin-top: 20px;
}

.side-bar-content .logo-cls {
  width: 32px;
  height: 32px;
}

.side-bar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.side-bar-logo-text {
  font-size: 12px;
  margin-top: 6px;
  color: #000;
  scale: 0.8;
}

.side-bar-search, .side-bar-history {
  cursor: pointer;
}

.side-bar-search-text {
  font-size: 12px;
  color: #000;
  margin-top: 2px;
}

.side-bar-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding-bottom: 16px;
}
.side-bar-footer-item {
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  cursor: pointer;
}
.side-bar-footer-item:hover {
  background-color: #fff3;
}
.icon {
  font-size: 20px;
  color: #252b3a;
}

</style>

<style>
  .side-bar .logo .mc-header-logo {
    width: 66%;
  }

  .side-bar .logo .mc-header-title {
    color: #000;
  }
</style>