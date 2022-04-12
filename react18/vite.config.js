import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh'; // 一个可以热更新的插件

export default defineConfig({
    plugins: [reactRefresh], // 插件数组
});