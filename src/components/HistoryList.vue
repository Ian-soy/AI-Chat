<template>
    <div class="collapse-container">
        <template v-if="state.dataList.length">
            <div class="history-item" :class="{'active': item.id === currentItem?.id}" v-for="item in state.dataList" :key="item.id" @click="chooseItem(item)">     
                <div class="history-item-top">
                    <span>{{ item?.title }}</span>
                </div>
                <div class="history-item-bottom">
                    <span class="create-time">{{ item.createTime }}</span>
                </div>
            </div>
        </template>

        <div v-if="!state.dataList.length" class="history-list-box empty">
            <div class="history-list-empty">
                <i class="icon icon-data-storage"></i>
                <span>暂无数据</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['historyDataList'])
import { ref, onMounted, reactive } from 'vue'
const currentItem = ref<any>()
const state = reactive({
    dataList: [] as any[]
});

const chooseItem = (item: any) => {
    currentItem.value = item;
    emit('historyDataList', item);
    getHistoryData();
}

const clearCurrentItem = () => {
    currentItem.value = null;
}

const getHistoryData = () => {
    const historyData = localStorage.getItem('historyData');
    if (historyData) {
        state.dataList = JSON.parse(historyData);
    }
}

defineExpose({ getHistoryData, clearCurrentItem })

onMounted(() => {
    getHistoryData();
})


</script>

<style scoped>

.collapse-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.collapse-content {
    line-height: 1.5;
    color: var(--devui-text-weak, #575d6c);
}
.history-item.active, .history-item.open, .history-item:hover {
    background: linear-gradient(to right, #f3efff, #f3efff33, #e2f1fd33, #e2f1fd);
    box-shadow: 2px 2px 8px #e9e9e9;
    cursor: pointer;
}

.history-item {
    width: 100%;
    height: 82px;
    padding: 16px;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: var(--devui-base-bg, #ffffff);
}

.history-item .history-item-top {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}
.history-item .history-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.history-item .history-item-top span {
    flex: 1;
    height: 22px;
    line-height: 22px;
    font-size: var(--devui-font-size, 12px);
    padding-right: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-item .history-item-bottom .create-time {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #aeaeae;
}

.history-list-container .history-content .history-list-box.empty {
    display: flex;
    justify-content: center;
    align-items: center;
}
.history-list-container .history-content .history-list-box {
    flex: 1;
    margin-top: 8px;
    overflow: auto;
}

.history-list-container .history-content .history-list-box.empty .history-list-empty {

    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
}

.history-list-container .history-content .history-list-box.empty .history-list-empty span {
    margin-top: 20px;
    font-size: 14px;
    color: #71757f;
}

.icon-data-storage {
  font-size: 38px;
  color: #71757f;
}
</style>