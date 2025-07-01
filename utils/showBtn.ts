import { createApp } from 'vue';
import FixedButton from '@/components/FixedButton.vue';
let app:any = null;
export const showBtn = () => {
  if(app){
    return 
  }
  // 创建挂载节点
  const appContainer = document.createElement('div');
  appContainer.id = 'chrome-extension-vue-root';
  document.body.appendChild(appContainer);
  if (appContainer) {
    Object.assign(appContainer.style, {
      position: 'fixed',
      left: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: '9999',
      // 你可以根据需要添加更多样式
      // width: '300px',
      // background: '#fff',
      borderRadius: '10%',
    });
  }
  // 渲染 Vue 组件
  app = createApp(FixedButton);
  app.mount(appContainer);

  // 防止重复注入
  if (!document.getElementById('chrome-extension-vue-root')) {
    document.body.appendChild(appContainer);
  }
};
