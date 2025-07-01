import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { PluginOption } from "vite";

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];
  
  // Only load componentTagger in development mode using dynamic import
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger() as PluginOption);
    } catch (error: unknown) {
      console.warn('Could not load lovable-tagger:', error instanceof Error ? error.message : String(error));
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: "::",
      port: 8080,
      headers: {
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Cross-Origin-Opener-Policy': 'same-origin'
      }
    },
    // Add project name
    name: 'Amiram-Academy'
  };
});
