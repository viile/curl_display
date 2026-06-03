import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * `base` 控制构建产物里资源路径的前缀。
 *   - 开发模式 → 始终 '/'（vite dev server）
 *   - 生产构建 → 优先用 VITE_BASE 环境变量；否则 '/'
 *
 * 典型部署：
 *   - GitHub Pages (project page)：`VITE_BASE=/curl_runner/app/ npm run build`
 *   - 自定义域名根目录 / Tauri：保持默认 '/'
 */
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? process.env.VITE_BASE || '/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
}));
