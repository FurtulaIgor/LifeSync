import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  // Production optimizations
  build: {
    // Generate source maps for debugging (can be disabled for smaller bundles)
    sourcemap: false,
    
    // Minify with esbuild for better performance
    minify: 'esbuild',
    
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
    
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Optimize assets
    assetsDir: 'assets',
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
  },
  
  // Development server optimizations
  server: {
    port: 5173,
    strictPort: false, // Allow port switching in development
  },
  
  // Resolve optimizations
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Dependency pre-bundling optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})
