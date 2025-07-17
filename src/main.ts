import { createApp } from 'vue';
import { router } from "./router"
import App from './App.vue';
import i18n from "./locales/index.ts";
import './style.css'

import MateChat from '@matechat/core';

import '@devui-design/icons/icomoon/devui-icon.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(MateChat).use(ElementPlus).use(router).use(i18n).mount('#app');
