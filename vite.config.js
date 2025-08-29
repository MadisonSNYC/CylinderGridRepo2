import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React and DOM libs
          'vendor-react': ['react', 'react-dom'],
          
          // UI and icons
          'vendor-ui': ['lucide-react'],
          
          // Video and performance utilities
          'helix-core': [
            './src/components/EnhancedHelixProjectsShowcase.jsx',
            './src/components/helix/SpringConnection.jsx',
            './src/components/video/VideoLazy.jsx',
            './src/hooks/useIntersectionObserver.js'
          ],
          
          // Effects and panels (largest bundle)
          'effects': [
            './src/components/effects/ColorSchemeEffects.jsx',
            './src/components/effects/VisualEffects.jsx',
            './src/components/effects/CardDesignEffects.jsx',
            './src/components/effects/StructureEffects.jsx',
            './src/components/effects/NavigationEffects.jsx',
            './src/components/effects/TypographyEffects.jsx',
            './src/components/AdvancedHelixPanel.jsx',
            './src/components/EffectsControlPanel.jsx'
          ],
          
          // Context and state management
          'contexts': [
            './src/contexts/HelixContext.jsx',
            './src/hooks/useHelixConfig.js',
            './src/hooks/useLockedEffects.js',
            './src/hooks/useMigrationBridge.js'
          ],
          
          // Utilities and data
          'utils': [
            './src/utils/helixPositionCache.js',
            './src/utils/performanceMonitor.js',
            './src/data/projects.js'
          ]
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5173-iwuxtfp0mbk1piq87cab1-d85a23cd.manusvm.computer',
      '.manusvm.computer'
    ]
  }
})
