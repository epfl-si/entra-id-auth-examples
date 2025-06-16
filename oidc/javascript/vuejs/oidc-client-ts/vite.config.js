import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'; // Use node: prefix for built-in modules
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT) || 5173; // Default Vite port is 5173
const host = process.env.HOST || 'localhost'; // Default to 'localhost'

// HTTPS configuration
const enableHttps = process.env.ENABLE_HTTPS === 'true'; // Defaults to false if not set

let httpsConfig = false;

  if (enableHttps) {
    // Allow overriding cert paths from .env too
    const keyPath = process.env.HTTPS_KEY_PATH || 'certs/dev-server.key';
    const certPath = process.env.HTTPS_CERT_PATH || 'certs/dev-server.crt';
    try {
      httpsConfig = {
        key: fs.readFileSync(path.resolve(__dirname, keyPath)),
        cert: fs.readFileSync(path.resolve(__dirname, certPath)),
      };
      console.log(`HTTPS enabled for dev server using key: ${keyPath}, cert: ${certPath}`);
    } catch (error) {
      console.warn(
        `Could not load HTTPS certificates (key: ${keyPath}, cert: ${certPath}). Error: ${error.message}. Falling back to HTTP.`
      );
	httpsConfig = false; // Fallback if files are not found
    }
  } else {
      httpsConfig = false;
      console.log('HTTPS explicitly disabled via .env (ENABLE_HTTPS=false).');
  }


// Define the list of allowed hosts for development
// This is important if you are accessing the dev server by a specific hostname
// It helps Vite's WebSocket connection for HMR work correctly and prevents host header attacks.
const allowedDevHosts = [host, 'localhost', '127.0.0.1'];

export default defineConfig(({ command, mode }) => {
  // Base configuration common to both 'serve' (dev) and 'build'
  const commonConfig = {
    plugins: [vue()],
  };

  if (command === 'serve') {
    // Development server specific configuration
    return {
      ...commonConfig,
      server: {
        host: true,       // Listen on all network interfaces (0.0.0.0), essential for Docker access
        port: port,       // The port Vite will listen on
        strictPort: true, // Exit if port is already in use
        https: httpsConfig, // Enable HTTPS using your generated certificates
        open: false,      // Don't automatically open in browser (can be true if desired)
        hmr: {
	    host: host,
	    port: port,
	    protocol: 'wss',
        }
      }
    };
  } else {
    // Build specific configuration
    return {
      ...commonConfig,
      build: {
        // outDir: 'dist', // Default
        // sourcemap: true, // For production sourcemaps
      },
    };
  }
});
