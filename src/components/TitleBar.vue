<!-- tabbar -->
<template>
  <div class="title-bar">
    <McHeader class="logo" :logoImg="logo">
    </McHeader>
    <div class="controls">
        <button @click="changeLangue" class="header-btn-cls lang-cls"> {{ langue === 'zh' ? 'CN' : 'EN' }} </button>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="新对话"
          placement="top"
        >
          <button @click="newConversation" class="header-btn-cls"><i class="icon icon-add"></i></button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="历史记录"
          placement="top"
        >
          <button @click="newRecord" class="header-btn-cls"><i class="icon" :class="{'icon-nav-collapse': expandStatus, 'icon-nav-expand': !expandStatus}"></i></button>
        </el-tooltip>

        <button class="header-btn-cls title-login-cls">登录</button>
        
        <button class="btn-seperate"> | </button>
        <button @click="handleMinimize" title="最小化" class="header-btn-cls" id="min-btn"><i class="icon icon-code-editor-less"></i></button>
        <button @click="toggleMaximize" title="最大化" class="header-btn-cls" id="max-btn"> <i class="icon" :class="{'icon-frame-contract': isMaximized, 'icon-frame-expand': !isMaximized}"></i></button>
        <button @click="close" title="关闭" class="header-btn-cls" id="close-btn"><i class="icon icon-code-editor-close"></i></button>
    </div>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits(['newConversation', 'newRecord'])
    import logo from '../assets/logo-32.png';
    import { ref } from 'vue'
    const isMaximized = ref(false)
    const expandStatus = ref(false)
    const langue = ref('zh')
    const newConversation = () => {
      emit('newConversation')
    }
    const newRecord = () => {
      emit('newRecord')
      expandStatus.value = !expandStatus.value
    }

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

    const changeLangue = () => {
      if (langue.value === 'zh') {
        langue.value = 'en'
      } else {
        langue.value = 'zh'
      }
    }
</script>

<style scoped>
/* 关键样式 */
.title-bar {
  -webkit-app-region: drag; /* 允许拖拽区域:ml-citation{ref="3,5" data="citationList"} */
  height: 42px;
  background: #f3f5f7;
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
.controls {
  display: flex;
}
.controls button {
  -webkit-app-region: no-drag; /* 禁止按钮拖拽:ml-citation{ref="3" data="citationList"} */
  border: none;
  cursor: auto;
  border-radius: 0;
  width: 50px;
  background: #f3f5f7;
  color: #252b3a;
}

.controls button:hover {
  border: none;
}

.controls #close-btn:hover{
    background-color: red;
    color: #f3f5f7;
}

.controls .header-btn-cls:hover, .controls #max-btn:hover{
    background-color: #eee;
    cursor: pointer;
}

.controls .title-login-cls {
  font-size: 12px !important;
  width: 34px !important;
  height: 34px;
  margin: 3px 8px;
  background: #eee !important;
  color: #252b3a;
  text-align: center;
  line-height: 35px;
  border-radius: 50%;
  cursor: pointer !important;
  padding: 0;
}

.lang-cls {
  font-size: 14px;
}

.lang-cls:hover {
  background-color: #f3f5f7 !important;

}

.controls button:focus, .controls button:focus-visible{
  outline: none;
}

.btn-seperate {
  color: #e1dfdf !important;
}

</style>

<style>
  .title-bar .logo .mc-header-logo {
    width: 66%;
  }
</style>