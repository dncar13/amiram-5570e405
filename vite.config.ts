
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { PluginOption } from "vite";
import { securityHeaders } from "./vite-security-headers";

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [
    react(),
    securityHeaders({
      // Custom CSP for Supabase + React/Vite app - improved to reduce wildcards
      csp: mode === 'production' 
        ? "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://llyunioulzfbgqvmeaxq.supabase.co wss://llyunioulzfbgqvmeaxq.supabase.co https://api.firebase.com https://fonts.googleapis.com https://fonts.gstatic.com https://firebaseapp.com https://cloudfunctions.net; img-src 'self' data: https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://llyunioulzfbgqvmeaxq.supabase.co wss://llyunioulzfbgqvmeaxq.supabase.co https://api.firebase.com https://fonts.googleapis.com https://fonts.gstatic.com https://firebaseapp.com https://cloudfunctions.net; img-src 'self' data: https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
      frameOptions: 'DENY',
      contentTypeOptions: true,
      permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), fullscreen=(self)',
    })
  ];
  
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
    },
    // Add project name
    name: 'Amiram-Academy'
  };
});
