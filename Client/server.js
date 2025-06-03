// server.js (React)
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // כל בקשה ל־/api תעבור לשרת Express
    },
  },
});

