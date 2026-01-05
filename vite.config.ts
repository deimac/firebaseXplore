
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do root do projeto
  const env = loadEnv(mode, path.resolve(import.meta.dirname), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "server", "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    base: "./",
    publicDir: path.resolve(import.meta.dirname, "client", "public"),

    // SEÇÃO ADICIONADA: Proxy para o servidor de desenvolvimento
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/trpc': { // O proxy é para /trpc, que é o endpoint da nossa API
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: path.resolve(import.meta.dirname, "dist", "public"),
      emptyOutDir: true,
      sourcemap: process.env.NODE_ENV === 'development',
      minify: 'terser',
      rollupOptions: {
        external: [
          /^\/umami/,
        ],
        // SEÇÃO ADICIONADA: Otimização de compilação
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'wouter'],
            'trpc': ['@trpc/client', '@trpc/react-query'],
          },
        },
      },
    },
    
    // SEÇÃO ADICIONADA: Configuração de preview
    preview: {
        port: 5173,
        host: '0.0.0.0',
    },
  };
});
