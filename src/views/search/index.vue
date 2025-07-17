<template>
  <div :class="{'container-cls': !isElectronEnv()}">
    <TitleBar v-if="isElectronEnv()" @newConversation="handleConversation" @newRecord="handleRecord" />
    <SideBar v-else @newConversation="handleConversation" @newRecord="handleRecord" />
    <div :class="{'main-cls': !isElectronEnv(), 'main': isElectronEnv()}">
      <div class="history-list-container" :class="{'not-expand': !expandStatus}" :style="{ height: containerHeight}">
        <div class="history-content" :class="{'not-expand': !expandStatus}">
          <div  class="history-header">
            <div  class="history-header-left">
              <span  class="history-title">{{ $t('search006') }}</span>
            </div>
          </div>

          <label  class="devui-search devui-search--md devui-search--left history-search">
            <div class="devui-search__icon">
              <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="dv-search-icon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M7.71295742,1.53283795 C11.0266659,1.53283795 13.7129574,4.21912945 13.7129574,7.53283795 C13.7129574,9.0690006 13.1356609,10.4703284 12.1861834,11.5317059 L14.5333041,13.8784875 C14.7285663,14.0737497 14.7285663,14.3903321 14.5333041,14.5855943 C14.3597378,14.7591606 14.0903134,14.7784458 13.8954453,14.6434497 L13.8261974,14.5855943 L11.4604434,12.2188804 C10.4336319,13.0411023 9.13072017,13.5328379 7.71295742,13.5328379 C4.39924893,13.5328379 1.71295742,10.8465464 1.71295742,7.53283795 C1.71295742,4.21912945 4.39924893,1.53283795 7.71295742,1.53283795 Z M7.71295742,2.53283795 C4.95153368,2.53283795 2.71295742,4.7714142 2.71295742,7.53283795 C2.71295742,10.2942617 4.95153368,12.5328379 7.71295742,12.5328379 C10.4743812,12.5328379 12.7129574,10.2942617 12.7129574,7.53283795 C12.7129574,4.7714142 10.4743812,2.53283795 7.71295742,2.53283795 Z" id="形状结合" fill="#71757F" fill-rule="nonzero"></path>
                </g>
              </svg>
            </div>
            <div class="devui-input devui-input--md">
              <div class="devui-input__wrapper">
                <input class="devui-input__inner" :placeholder="$t('search007')" autofocus="false" maxlength="9007199254740991" title="" type="text" value="">

              </div>
            </div>
          </label>

          <HistoryList ref="historyListRef" @historyDataList="handleHistoryList" />
        </div>
      </div>
      <Chat ref="chatRef" @newHistoryList="updateHistoryList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import Chat from '../../components/Chat.vue'
import TitleBar from '../../components/TitleBar.vue'
import SideBar from '../../components/SideBar.vue'
import HistoryList from '../../components/HistoryList.vue'
import { isElectronEnv } from '../../utils/env.ts'

const chatRef = ref(null)
const historyListRef = ref(null)
const expandStatus = ref(true)

const containerHeight = computed(() => 
  !isElectronEnv() ? '100%' : 'calc(100vh - 82px)'
);

const handleConversation = () => {
  nextTick(() => {
    const chatDom = chatRef?.value as any
    const historyDom = historyListRef?.value as any
    chatDom.newConversation() // 新会话
    historyDom.clearCurrentItem() // 清空历史记录中当前选中会话
  })
}

const handleRecord = () => {
  expandStatus.value = !expandStatus.value
}

const handleHistoryList = (item: any) => {
  console.log(item);
  nextTick(() => {
    const chatDom = chatRef?.value as any
    chatDom.chooseHistoryItem(item)
  })
}

const updateHistoryList = () => {
  nextTick(() => {
    const historyDom = historyListRef?.value as any
    historyDom.getHistoryData()
  })
}

</script>

<style scoped>
  .main {
    flex: 1;
    height: 100%;
    background: #fff;
    margin: 0 auto;
    display: flex;
    color: #252b3a;
    position: relative;
    overflow: hidden;
  }

  .container-cls {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-image: url('../../assets/global-bg.png');
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
    background: #fff;
    margin: 0 auto;
    border-radius: 16px;
    display: flex;
    color: #252b3a;
    position: relative;
    overflow: hidden;
  }

  .main-cls .history-list-container {
    border-radius: 16px 0 0 16px;
  }

  .history-list-container {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 380px;
    width: 25%;
    padding: 20px;
    color: #252b3a;
    transition: all .3s ease-in-out;
    background-color: #f3f5f7;
  }

  .history-list-container.not-expand {
    width: 0;
    min-width: 0;
    padding: 0;
    opacity: 0;
  }

  .history-content.not-expand {
    opacity: 0;
  }

  .history-content {
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 12px;
    transition: all .3s ease-in-out;
  }

  .history-list-container .history-content .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-list-container .history-content .history-header .history-header-left, .history-list-container .history-content .history-header .history-header-right {
    display: flex;
    align-items: center;
  }

  .history-list-container .history-content .history-title {
    font-size:  14px;
    font-weight: 700;
    margin-bottom: 8px;
    white-space: nowrap;
  }

  .history-list-container .history-content .devui-search {
    position: relative;
    border-radius: var(--devui-border-radius, 2px);
    transition: border-color .3s var(--devui-animation-ease-in-out-smooth, cubic-bezier(.645, .045, .355, 1)), box-shadow var(--devui-animation-duration-base, .2s) var(--devui-animation-ease-in, cubic-bezier(.5, 0, .84, .25));
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .history-list-container .history-content .devui-search--left .devui-search__icon {
    left: 0;
  }

  .history-list-container .history-content .devui-search__icon {
    pointer-events: all;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    right: 0;
    top: 0;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .history-list-container .history-content .devui-search .devui-input {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    padding: 4px 60px 4px 8px;
    font-size: var(--devui-font-size-md, 12px);
    color: var(--devui-text, #252b3a);
    box-sizing: border-box;
    border: 1px solid var(--devui-form-control-line, #d7d8da);
    border-radius: var(--devui-border-radius, 2px);
    background-color: var(--devui-form-control-bg, #ffffff);
    transition: border-color .3s var(--devui-animation-ease-in-out-smooth, cubic-bezier(.645, .045, .355, 1));
  }

  .history-list-container .history-content .devui-search--left .devui-input {

    padding-right: 32px;
    padding-left: 32px;
  }

  .history-list-container .history-content .history-search .devui-input {
    border: none;
    border-radius: 100px;
  }

  .history-list-container .history-content .devui-input__wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid var(--devui-form-control-line, #d7d8da);
    border-radius: var(--devui-border-radius, 2px);
    background-color: var(--devui-form-control-bg, #ffffff);
    transition: border-color .3s var(--devui-animation-ease-in-out-smooth, cubic-bezier(.645, .045, .355, 1)), box-shadow var(--devui-animation-duration-base, .2s) var(--devui-animation-ease-in, cubic-bezier(.5, 0, .84, .25));
    height: 100%;
}

.history-list-container .history-content .devui-search .devui-input__wrapper {

    border: none;
    padding: 0;
}

.history-list-container .history-content .devui-search .devui-input__inner {
    padding: 0;
}

.history-list-container .history-content .devui-input__inner {
    width: 100%;
    height: 100%;
    color: var(--devui-text, #252b3a);
    font-size: inherit;
    padding: 4px 0;
    border: none;
    background: none;
    outline: none;
    box-sizing: border-box;
}

</style>
