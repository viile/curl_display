import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import App from './App.vue';
import { i18n } from './i18n';
// 提前导入以便在首屏渲染前就根据 localStorage 应用主题
import './composables/useTheme';
import './styles/global.css';

const app = createApp(App);
app.use(i18n);
app.use(ElementPlus);
app.mount('#app');
