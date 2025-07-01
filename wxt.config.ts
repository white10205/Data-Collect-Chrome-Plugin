import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: [
      'webRequest',
      'webRequestBlocking',
      'tabs', // 用于 chrome.tabs.sendMessage
      'downloads',
      'storage'
    ],
    host_permissions: [
      // Manifest V3 必需
      '*://*.xiaohongshu.com/*',
      '*://edith.xiaohongshu.com/*', // 明确包含子域名
    ],
    content_scripts: [
      {
        matches: ['*://*.xiaohongshu.com/*'],
        js: ['content-scripts/content.js'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['inject.js'],
        matches: ['*://*.xiaohongshu.com/*'],
      },
    ],
  },
  outDir: 'dist',
});
