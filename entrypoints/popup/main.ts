import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Switch, Button } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css'

createApp(App).use(Switch).use(Button).use(Button).mount('#app');
