<template>
  <McLayout class="container">
    <McLayoutContent
      v-if="startPage"
      style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px"
    >
      <McIntroduction
        :logoImg="logo"
        :title="'SpaceHelper'"
        :subTitle="'Hi，欢迎使用 SpaceHelper'"
        :description="description"
      ></McIntroduction>
      <McPrompt
        :list="introPrompt.list"
        :direction="introPrompt.direction"
        class="intro-prompt"
        @itemClick="onSubmit($event.label)"
      ></McPrompt>
    </McLayoutContent>
    <McLayoutContent id="content-container-id" class="content-container" v-else>
      <template v-for="(msg, idx) in messages" :key="idx">
        <McBubble
          v-if="msg.from === 'user'"
          :content="msg.content"
          :align="'right'"
          :avatarConfig="{ imgSrc: logo }"
        >
        </McBubble>
        <McBubble v-else :loading="msg.loading" :avatarConfig="{ imgSrc: logo }">
          <McMarkdownCard :content="msg.content"></McMarkdownCard>
        </McBubble>
      </template>
    </McLayoutContent>
    <div class="shortcut" style="display: flex; align-items: center; gap: 8px">
      <McPrompt
        v-if="!startPage"
        :list="simplePrompt"
        :direction="'horizontal'"
        style="flex: 1"
        @itemClick="onSubmit($event.label)"
      ></McPrompt>
      <Button
        style="margin-left: auto"
        icon="add"
        shape="circle"
        title="新建对话"
        size="md"
        @click="newConversation"
      />
    </div>
    <McLayoutSender>
      <McMention v-model="isVisible" :prefix="prefix" @searchChange="onSearchChange" @toggleChange="onToggleChange">
        <McInput ref="inputRef" :value="inputValue" :maxLength="2000" @change="(e: string) => (inputValue = e)" @submit="onSubmit">
          <template #extra>
            <div class="input-foot-wrapper">
              <div class="input-foot-left">
                <span class="border-cls" v-for="(item, index) in inputFootIcons" :key="index" @click="onIntelligentClick(item)">
                  <i :class="item.icon"></i>{{ item.text }}
                </span>
                <span class="input-foot-dividing-line"></span>
                <span class="input-foot-maxlength">{{ inputValue.length }}/2000</span>
              </div>
              <div class="input-foot-right">
                <Button icon="op-clearup" shape="round" :disabled="!inputValue" @click="inputValue = ''"><span class="demo-button-content">清空输入</span></Button>
              </div>
            </div>
          </template>
        </McInput>
        <template #menu>
          <McList :data="listData" :inputEl="inputRef" enableShortKey @select="onListSelect"></McList>
        </template>
      </McMention>
    </McLayoutSender>
  </McLayout>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Button } from 'vue-devui/button';
import 'vue-devui/button/style.css';
import OpenAI from 'openai';
import { debounce } from 'lodash-es';
import { ElNotification } from 'element-plus';
import logo from '../assets/logo-32.png';

const isVisible = ref(false);
const inputRef = ref();
const listData = ref([]);
const prefix = ['@'];
let triggerIndex;
let cursorIndex;
let currentTrigger;
let currentListLabel;
const lastSubmitTime = ref(null); // 上次提交时间

const description = [
  'SpaceHelper 可协助开发者进行代码编写、知识检索、信息查询及文档撰写等。' ,
  '作为人工智能模型，SpaceHelper 提供的解答可能并非始终精准无误，不过您的反馈将助力 SpaceHelper 持续优化。'
];

const content = ref(`
# 快速排序（Quick Sort）

### 介绍
**快速排序（Quick Sort）**：是一种高效的排序算法，它采用分治法（Divide and Conquer）的思想。它的基本思路是：

1. 选择一个基准值（pivot）
2. 将数组分成两部分：小于基准值的部分和大于等于基准值的部分
3. 递归地对这两部分进行排序

### 代码实现

1. 以下是快速排序的实现方法
\`\`\`ts
function quickSort(arr) {
  function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 使用示例
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr)); // 输出排序后的数组
}
\`\`\`
`);
const introPrompt = {
  direction: 'horizontal',
  list: [
    {
      value: 'quickSort',
      label: '帮我生成一份威海5日游计划',
      iconConfig: { name: 'icon-info-o', color: '#5e7ce0' },
      desc: '使用小红书格式进行排版布局',
    },
    {
      value: 'helpMd',
      label: '什么是MCP?',
      iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
      desc: '了解MCP概念、原理以及用法',
    },
    {
      value: 'bindProjectSpace',
      label: '如何创建vue3+vite+electron的项目',
      iconConfig: { name: 'icon-priority', color: '#3ac295' },
      desc: '从0到1创建一个完整的桌面端项目',
    },
  ],
};
const simplePrompt = [
  {
    value: 'quickSort',
    iconConfig: { name: 'icon-info-o', color: '#5e7ce0' },
    label: '帮我生成一份威海5日游计划',
  },
  {
    value: 'helpMd',
    iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
    label: '什么是MCP?',
  },
];
const startPage = ref(true);
const inputValue = ref('');
const inputFootIcons = [
  { icon: 'icon-at', text: '智能体' },
  // { icon: 'icon-standard', text: '词库' },
  { icon: 'icon-appendix', text: '附件' },
];

const messages = ref<any[]>([]);

const newConversation = () => {
  startPage.value = true;
  messages.value = [];
}

const onSearchChange = (e) => {
  triggerIndex = e.triggerIndex;
  cursorIndex = e.cursorIndex;
  currentTrigger = e.trigger;
  if (e.value.includes(currentListLabel)) {
    nextTick(() => {
      isVisible.value = false;
    });
    return;
  }
  if (currentTrigger === '@') {
    listData.value = [
      { label: 'Builder', value: 'builder' },
      { label: 'Builder with MCP', value: 'mcp' },
    ];
  }
};

const onListSelect = (e) => {
  isVisible.value = false;
  if (e.label.indexOf('上传') > -1) {
    console.log('上传文件');
  } else {
    currentListLabel = e.label;
    inputValue.value = inputValue.value.slice(0, triggerIndex) + currentTrigger + e.label + inputValue.value.slice(cursorIndex);
  }
 
};

const onToggleChange = (e) => {
  console.log('mention toggle change', e);

};

// 点击智能体，附件操作
const onIntelligentClick = (e) => {
  isVisible.value = true;
  if (e.text === '智能体') {
    listData.value = [
      { label: 'Builder', value: 'builder' },
      { label: 'Builder with MCP', value: 'mcp' },
    ];
    triggerIndex = inputValue.value.length;
    cursorIndex = inputValue.value.length + 1;
    currentTrigger = '@';
    inputValue.value = inputValue.value.slice(0, inputValue.value.length) + '@';
  } else if (e.text === '附件') {
    listData.value = [
      { label: '上传文件', value: 'upload' },
      { label: '上传文件夹', value: 'uploadFolder' },
    ];
  }
}

let lastScrollHeight = 0;
watch(() => messages.value, () => {
  nextTick(() => {
    const container = document.getElementById('content-container-id')
    if (!container) return
    const newHeight = container.scrollHeight;
    if (Math.abs(newHeight - lastScrollHeight) > 30) {
      requestAnimationFrame(() => {
        container.scrollTo({
          top: newHeight,
          behavior: 'smooth'
        })
      })
      lastScrollHeight = newHeight
    }
  })
}, { deep: true })

// 创建deepseek客户端
const client = new OpenAI({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY, // 模型APIKey
  baseURL: import.meta.env.VITE_DEEPSEEK_BASE_URL, // 模型API地址
  dangerouslyAllowBrowser: true, // 浏览器环境使用需要开启
});

// 提交信息
const onSubmit = debounce((evt: any) => {
  const now = Date.now();

  if (!lastSubmitTime.value || (now - lastSubmitTime.value) > 60000) {
    lastSubmitTime.value = now;
  } else {
    ElNotification({
      title: 'Warning',
      message: '60秒内不能重复提交，token限制！',
      type: 'warning',
    })
    return;
  }

  isVisible.value = false;
  if (!evt || evt === "@") return;
  inputValue.value = '';
  startPage.value = false;

  // 用户发送消息
  messages.value.push({
    from: 'user',
    content: evt,
    avatarConfig: { name: 'user' },
  });

  // setTimeout(() => {
  //   // 模型返回消息
  //   messages.value.push({
  //     from: 'model',
  //     content: evt,
  //     loading: true
  //   });
  // }, 200);

  // setTimeout(() => {
  //   // 模型返回消息
  //   messages.value.pop();
  //   messages.value.push({
  //     from: 'model',
  //     content: content.value,
  //     loading: false
  //   });
  // }, 800);

  fetchData(evt);
}, 500);

const fetchData = async (ques: any) => {
  messages.value.push({
    from: 'model',
    content: '',
    avatarConfig: { name: 'model' },
    loading: true,
  });
  const completion = await client.chat.completions.create({
    model: 'deepseek-chat', // 根据deepseek模型列表进行替换
    messages: [{ role: 'user', content: ques }],
    stream: true, // 为 true 则开启接口的流式返回
  });
  for await (const chunk of completion) {
    requestAnimationFrame(() => {
      messages.value[messages.value.length - 1].loading = false;
      const content = chunk.choices[0]?.delta?.content || '';
      const chatId = chunk.id;
      messages.value[messages.value.length - 1].content += content;
      messages.value[messages.value.length - 1].id = chatId;
    })
  }
};

</script>

<style scoped>
.container {
  max-width: 800px;
  min-width: 500px;
  height: calc(100vh - 82px);
  padding: 20px;
  gap: 8px;
  background: #fff;
  margin: 0 auto;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  padding-right: 10px;
}
.mc-layout-content.content-container::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #418a9c, #e7adf3);
  border-radius: 5px;
}
.mc-layout-content.content-container::-webkit-scrollbar-thumb {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.mc-layout-content.content-container::-webkit-scrollbar {
  width: 6px;
}
.input-foot-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-right: 8px;

  .input-foot-left {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      font-size: 14px;
      line-height: 18px;
      color: #252b3a;
      cursor: pointer;
    }

    .input-foot-dividing-line {
      width: 1px;
      height: 14px;
      background-color: #d7d8da;
    }

    .input-foot-maxlength {
      font-size: 14px;
      color: #71757f;
    }
  }

  .input-foot-right {
    .demo-button-content {
      font-size: 14px;
    }

    & > *:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>

<style>
    .container .mc-bubble .mc-bubble-content.filled{
        background: #f5f5f5;
        color:  #252b3a;
        text-align: left;
    }
    .container .mc-bubble .mc-bubble-content-container {
        max-width: 70% !important;
    }
    .border-cls {
      border: 1px solid #acaeb3;
      padding: 1px 4px;
      border-radius: 5px;
      font-size: 12px !important;
    }
</style>
