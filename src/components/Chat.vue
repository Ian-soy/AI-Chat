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
    <div class="shortcut" style="display: flex; align-items: center; gap: 8px; position: release;">
      <McPrompt
        v-if="!startPage"
        :list="simplePrompt"
        :direction="'horizontal'"
        style="flex: 1"
        @itemClick="onSubmit($event.label)"
      ></McPrompt>
      <el-select
        id="modelSelectRef"
        v-model="currentModel"
        placeholder="Select"
        size="small"
        style="max-width: 180px"
        placement="top-start"
        class="model-cls"
        collapse-tags
        popper-class="custom-header"
        @change="updateInputImage"
      >
        <template #header>
          模型
        </template>
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        <img :src="item.url" />
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
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
        <McInput class="content-input-cls" ref="inputRef" :placeholder="currentPlaceholder" :value="inputValue" :maxLength="4000" @change="(e: string) => (inputValue = e)" @submit="onSubmit">
          <template #extra>
            <div class="input-foot-wrapper">
              <div class="input-foot-left">
                <template v-for="(item, index) in inputFootIcons" :key="index">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="item.tip"
                    placement="top"
                  >
                    <span class="border-cls"  @click="onIntelligentClick(item)">
                      <i :class="item.icon"></i>{{ item.text }}
                    </span>
                  </el-tooltip>
                </template>
                
                <span class="input-foot-dividing-line"></span>
                <span class="input-foot-maxlength">{{ inputValue.length }}/4000</span>
              </div>
              <div class="input-foot-right">
                <Button icon="op-clearup" shape="round" :disabled="!inputValue" @click="inputValue = ''">
                  <span class="demo-button-content">清空输入</span>
                </Button>
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
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { Button } from 'vue-devui/button';
import 'vue-devui/button/style.css';
import OpenAI from 'openai';
import { debounce } from 'lodash-es';
import { ElNotification, ElTooltip } from 'element-plus';
import logo from '../assets/logo-32.png';

const isVisible = ref(false);
const inputRef = ref();
const listData = ref([{
  label: '',
  value: ''
}]);

const currentPlaceholder = ref('请输入您的问题，并按Enter发送，按Shift+Enter换行');

// 模型选择
const currentModel = ref('deepseek-chat');
const modelOptions = ref([
  {
    value: 'DeepSeek-Chat',
    label: 'deepseek-chat',
    url: "data:image/svg+xml,%3csvg%20height='1em'%20style='flex:none;line-height:1'%20viewBox='0%200%2024%2024'%20width='1em'%20xmlns='http://www.w3.org/2000/svg'%3e%3ctitle%3eDeepSeek%3c/title%3e%3cpath%20d='M23.748%204.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434%201.202-.422%201.84.027%201.436.633%202.58%201.838%203.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526%205.526%200%2001-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365%2011.365%200%2000-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055%203.055%200%2001-.465.137%209.597%209.597%200%2000-2.883-.102c-1.885.21-3.39%201.102-4.497%202.623C.082%208.606-.231%2010.684.152%2012.85c.403%202.284%201.569%204.175%203.36%205.653%201.858%201.533%203.997%202.284%206.438%202.14%201.482-.085%203.133-.284%204.994-1.86.47.234.962.327%201.78.397.63.059%201.236-.03%201.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926%201.096-1.296%202.746-2.642%203.392-7.003.05-.347.007-.565%200-.845-.004-.17.035-.237.23-.256a4.173%204.173%200%20001.545-.475c1.396-.763%201.96-2.015%202.093-3.517.02-.23-.004-.467-.247-.588zM11.581%2018c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696%204.696%200%20011.529-.039c2.132.312%203.946%201.265%205.468%202.774.868.86%201.525%201.887%202.202%202.891.72%201.066%201.494%202.082%202.48%202.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306%200%2001.415-.287.302.302%200%2001.2.288.306.306%200%2001-.31.307.303.303%200%2001-.304-.308zm3.11%201.596c-.2.081-.399.151-.59.16a1.245%201.245%200%2001-.798-.254c-.274-.23-.47-.358-.552-.758a1.73%201.73%200%2001.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559%200%2001-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136%201.146.016.352.144.618.408%201.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z'%20fill='%234D6BFE'%3e%3c/path%3e%3c/svg%3e"
  },
  {
    value: 'DeepSeek-Reasoner',
    label: 'deepseek-reasoner',
    url: "data:image/svg+xml,%3csvg%20height='1em'%20style='flex:none;line-height:1'%20viewBox='0%200%2024%2024'%20width='1em'%20xmlns='http://www.w3.org/2000/svg'%3e%3ctitle%3eDeepSeek%3c/title%3e%3cpath%20d='M23.748%204.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434%201.202-.422%201.84.027%201.436.633%202.58%201.838%203.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526%205.526%200%2001-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365%2011.365%200%2000-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055%203.055%200%2001-.465.137%209.597%209.597%200%2000-2.883-.102c-1.885.21-3.39%201.102-4.497%202.623C.082%208.606-.231%2010.684.152%2012.85c.403%202.284%201.569%204.175%203.36%205.653%201.858%201.533%203.997%202.284%206.438%202.14%201.482-.085%203.133-.284%204.994-1.86.47.234.962.327%201.78.397.63.059%201.236-.03%201.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926%201.096-1.296%202.746-2.642%203.392-7.003.05-.347.007-.565%200-.845-.004-.17.035-.237.23-.256a4.173%204.173%200%20001.545-.475c1.396-.763%201.96-2.015%202.093-3.517.02-.23-.004-.467-.247-.588zM11.581%2018c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696%204.696%200%20011.529-.039c2.132.312%203.946%201.265%205.468%202.774.868.86%201.525%201.887%202.202%202.891.72%201.066%201.494%202.082%202.48%202.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306%200%2001.415-.287.302.302%200%2001.2.288.306.306%200%2001-.31.307.303.303%200%2001-.304-.308zm3.11%201.596c-.2.081-.399.151-.59.16a1.245%201.245%200%2001-.798-.254c-.274-.23-.47-.358-.552-.758a1.73%201.73%200%2001.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559%200%2001-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136%201.146.016.352.144.618.408%201.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z'%20fill='%234D6BFE'%3e%3c/path%3e%3c/svg%3e"
  },
  {
    value: 'Llama 3.1 405B',
    label: 'Llama 3.1 405B',
    url: "https://thinkany.ai/models/llama-405b.png"
  }
]);


const prefix = ['@'];
let triggerIndex: number | undefined;
let cursorIndex: number | undefined;
let currentTrigger: string;
let currentListLabel: any;
const lastSubmitTime = ref(0); // 上次提交时间

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
  { icon: 'icon-at', text: '智能体', tip: '输入"@"选择智能体'},
  // { icon: 'icon-standard', text: '词库' },
  { icon: 'icon-appendix', text: '附件', tip: '上传文件或文件夹'},
];

const messages = ref<any[]>([]);

// 
const updateInputImage = (val: any) => {
  nextTick(() => {
    const inputEl = document.querySelector('.model-cls .el-select__placeholder');
    const item = modelOptions.value.find(opt => opt.value === val);
    (inputEl as HTMLElement).style.backgroundImage = '';
    (inputEl as HTMLElement).style.backgroundImage = `url(${item?.url})`;
    console.log((inputEl as HTMLElement).style.backgroundImage, '(inputEl as HTMLElement).style.backgroundImage===>');
  })
}

const newConversation = () => {
  startPage.value = true;
  messages.value = [];
}

const onSearchChange = (e: { triggerIndex: any; cursorIndex: any; trigger: any; value: string | any[]; }) => {
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

const onListSelect = (e: { label: string | string[], value: string, model: boolean }) => {
  isVisible.value = false;
  if (e.label.indexOf('上传') > -1) {
    console.log('上传文件');
  } else {
    currentListLabel = e.label;
    inputValue.value = inputValue.value.slice(0, triggerIndex) + currentTrigger + inputValue.value.slice(cursorIndex);
    // 选择智能体时直接出发新增元素
    insertElementAgent(e.label as string);
    currentPlaceholder.value = "您正在与 " + e.label + " 进行对话";
  }
};

const onToggleChange = (e: any) => {
  console.log('mention toggle change', e);
};

// 新增智能体元素
const insertElementAgent = (label: string) => {
  // 如果已经存在智能体元素，直接控制现实隐藏
  if (document.querySelector('.choosed-agent-cls')) {
    const agent = document.querySelector('.choosed-agent-cls') as HTMLElement;
    const agentName = document.getElementById('agentName') as HTMLElement;
    agentName.innerHTML = '@' + label;
    agent.style.display = 'block';
    inputValue.value = inputValue.value.slice(0, inputValue.value.length - 1)
    return;
  }
  // 新增智能体元素
  const parent = document.querySelector('.content-input-cls .mc-input-content') as HTMLElement;
  const newElement = document.createElement('div');
  newElement.classList.add('choosed-agent-cls');
  newElement.style.width = '100%';
  newElement.innerHTML = '<div class="choosedAgent"><span id="agentName">@Builder</span><span id="closeAgent">x</span></div>';

  nextTick(()=>{
    // 展示具体智能体
    const agentName = document.getElementById('agentName') as HTMLElement;
    agentName.innerHTML = '@' + label;
    // 新增元素增加监听事件
    const closeAgent = document.getElementById('closeAgent') as HTMLElement;
    closeAgent.addEventListener('click', function() {
      // close事件直接控制元素显示隐藏
      const agent = document.querySelector('.choosed-agent-cls') as HTMLElement;
      agent.style.display = 'none';
      currentPlaceholder.value = '请输入您的问题，并按Enter发送，按Shift+Enter换行';
    });
  })
  // 直接插入到父元素开头
  parent.prepend(newElement);

  inputValue.value = inputValue.value.slice(0, inputValue.value.length - 1)
};


// 点击智能体，附件操作
const onIntelligentClick = (e: { text: string }) => {
  isVisible.value = true;
  if (e.text === '智能体') {
    listData.value = [
      { label: 'Builder', value: 'builder' },
      { label: 'Builder with MCP', value: 'mcp' }
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

  setTimeout(() => {
    // 模型返回消息
    messages.value.push({
      from: 'model',
      content: evt,
      loading: true
    });
  }, 200);

  setTimeout(() => {
    // 模型返回消息
    messages.value.pop();
    messages.value.push({
      from: 'model',
      content: content.value,
      loading: false
    });
  }, 800);

  // fetchData(evt);
}, 500);

const fetchData = async (ques: any) => {
  messages.value.push({
    from: 'model',
    content: '',
    avatarConfig: { name: 'model' },
    loading: true,
  });
  const completion = await client.chat.completions.create({
    model: currentModel.value, // 根据deepseek模型列表进行替换
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

onUnmounted(() => {
  const closeAgent = document.getElementById('closeAgent') as HTMLElement;
  closeAgent?.removeEventListener('click', function() {
    const agent = document.querySelector('.choosed-agent-cls') as HTMLElement;
    agent.remove();
  });
})

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
    .border-cls:hover {
      color: #000;
      border-color: #000;
    }
    .custom-header .el-select-dropdown__header {
      color: #606266;
      padding: 10px 20px;
    }
    .model-cls .el-select__wrapper {
      border-radius: 50px;
    }
    .model-cls .el-select__wrapper.is-focused {
      border-color: rgba(0, 0, 0, 0);
      box-shadow: 0 0 0 1px #dcdfe6;
    }

    .model-cls .el-select__placeholder {
      color: #252b3a;
    }

    .model-cls .el-select__placeholder {
      padding-left: 28px;
      background-position: 6px center;
      background-size: 16px;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3csvg%20height='1em'%20style='flex:none;line-height:1'%20viewBox='0%200%2024%2024'%20width='1em'%20xmlns='http://www.w3.org/2000/svg'%3e%3ctitle%3eDeepSeek%3c/title%3e%3cpath%20d='M23.748%204.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434%201.202-.422%201.84.027%201.436.633%202.58%201.838%203.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526%205.526%200%2001-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365%2011.365%200%2000-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055%203.055%200%2001-.465.137%209.597%209.597%200%2000-2.883-.102c-1.885.21-3.39%201.102-4.497%202.623C.082%208.606-.231%2010.684.152%2012.85c.403%202.284%201.569%204.175%203.36%205.653%201.858%201.533%203.997%202.284%206.438%202.14%201.482-.085%203.133-.284%204.994-1.86.47.234.962.327%201.78.397.63.059%201.236-.03%201.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926%201.096-1.296%202.746-2.642%203.392-7.003.05-.347.007-.565%200-.845-.004-.17.035-.237.23-.256a4.173%204.173%200%20001.545-.475c1.396-.763%201.96-2.015%202.093-3.517.02-.23-.004-.467-.247-.588zM11.581%2018c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696%204.696%200%20011.529-.039c2.132.312%203.946%201.265%205.468%202.774.868.86%201.525%201.887%202.202%202.891.72%201.066%201.494%202.082%202.48%202.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306%200%2001.415-.287.302.302%200%2001.2.288.306.306%200%2001-.31.307.303.303%200%2001-.304-.308zm3.11%201.596c-.2.081-.399.151-.59.16a1.245%201.245%200%2001-.798-.254c-.274-.23-.47-.358-.552-.758a1.73%201.73%200%2001.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559%200%2001-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136%201.146.016.352.144.618.408%201.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z'%20fill='%234D6BFE'%3e%3c/path%3e%3c/svg%3e");
    }
    .custom-header .el-select-dropdown__item.is-selected {
      color: #252b3a;
    }
    .custom-header .el-select-dropdown__item.is-selected img {
      color: #252b3a;
    }
    .custom-header .el-select-dropdown__item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .custom-header .el-select-dropdown__item img{
      width: 16px;
    }
    .intro-prompt .mc-list-horizontal{
      justify-content: center;
    }


    /* 智能体样式 */
    .content-input-cls .mc-input-content{
      flex-direction: column;
    }
    .choosedAgent {
      /* display: block; */
      color:  #252b3a;
      /* border: 1px solid #000; */
      font-size: 14px;
      padding: 4px 10px;
      display: block;
      border-radius: 10px;
      display: flex;
      background: #f0f0f0;
      margin-bottom: 6px;
      justify-content: space-between;
      width: -webkit-fill-available;
    }

    /* 智能体关闭按钮 */
    .choosedAgent #closeAgent {
      font-size: 14px;
      cursor: pointer;
    }
</style>
