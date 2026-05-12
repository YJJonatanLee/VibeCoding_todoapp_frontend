import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // VITE_API_BASE_URL을 .env에 설정하면 api.js가 그 절대 주소로 직접 요청한다.
  // 그 값이 없을 때만 아래 프록시(개발 서버 경유)가 사용된다.
  server: {
    proxy: {
      '/todos': {
        target:
          'https://port-0-vibecoding-todoapp-backend-mp23xjbw123a62ec.sel3.cloudtype.app',
        changeOrigin: true,
      },
    },
  },
})
