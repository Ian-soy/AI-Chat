import { createApp } from 'vue';
import App from './App.vue';
import './style.css'

import MateChat from '@matechat/core';

import '@devui-design/icons/icomoon/devui-icon.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(MateChat).use(ElementPlus).mount('#app');
