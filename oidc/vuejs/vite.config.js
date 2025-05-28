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
// (like biccsrv3.epfl.ch) rather than just 'localhost'.
// It helps Vite's WebSocket connection for HMR work correctly and prevents host header attacks.
const allowedDevHosts = [host, 'localhost', '127.0.0.1'];

export default defineConfig(({ command, mode }) => {
  // Base configuration common to both 'serve' (dev) and 'build'
  const commonConfig = {
    plugins: [vue()],
    // Example: Define global constants (can be accessed via import.meta.env.VITE_APP_VERSION)
    // define: {
    //   'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
    // },
    // Example: Configure aliases
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, './src'),
    //   },
    // },
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

        // Configure allowed hosts for the Vite dev server.
        // This is important when accessing the dev server using a hostname other than localhost,
        // especially when behind a proxy or in a Docker container accessed by hostname.
        // It affects things like HMR WebSocket connections.
        // If 'host: true' is set, Vite tries to be permissive, but explicitly listing hosts is safer.
        hmr: {
          // If you have a complex proxy setup, you might need to configure hmr.clientPort or hmr.host
          // clientPort: 443, // if your external port is 443 but vite is on 5173 internally
            // host: 'biccsrv3.epfl.ch', // Explicitly set HMR host if needed
	    host: host,
	    port: port,
	    protocol: 'wss',
        },
        // While `host: true` makes Vite listen on 0.0.0.0, for requests coming with a specific
        // Host header (like 'biccsrv3.epfl.ch'), Vite might still block them if not allowed.
        // This was more critical for older Vite versions, but good to be aware of.
        // The `allowedHosts` option in the main `server` config is for preventing DNS rebinding.
        // For Vite 5+, `server.host: true` usually makes `allowedHosts` less critical for simple access,
        // but if you encounter "Invalid Host header" for WebSockets or direct access, this is where to look.
        // Vite also has middleware for this, so `allowedHosts` might not be strictly needed if `host:true` is sufficient.
        // For direct access by name (biccsrv3.epfl.ch) and not through a reverse proxy that changes the host header:
        // Vite's internal checks related to hostname are often handled if `server.host: true` is correctly allowing 0.0.0.0
        // and your browser can resolve biccsrv3.epfl.ch to the machine running Docker.
        // The `allowedHosts` option that MSAL was referring to earlier is now usually within a sub-config
        // or handled by Vite's default behavior with `host: true`.
        // However, let's keep it for robustness as it was suggested by a previous error message.
        // Update: For Vite 5, this top-level `allowedHosts` might not be the correct place.
        // The "Blocked request. This host (...) is not allowed" error is usually addressed by
        // ensuring Vite binds to 0.0.0.0 (via `host: true`) and your network/firewall allows access.
        // The specific MSAL/Web Crypto issue is about HTTPS context.
        // Let's remove the explicit `allowedHosts` here as `host: true` + HTTPS should cover it.
        // If you *still* get an "Invalid Host header" from Vite itself (not MSAL),
        // you might need to look into `server.hmr.host` or more advanced proxy settings.
      },
      // For MSAL and Web Crypto, the main thing is that the dev server IS SERVING OVER HTTPS.
      // The `allowedHosts` setting previously discussed (`server.allowedHosts` in an older context)
      // was to prevent DNS rebinding attacks for the Vite dev server itself if accessed by name.
      // With `host: true`, Vite listens on all interfaces. The HTTPS setup ensures the secure context.
      // If Vite itself complains about "Invalid Host header" for the biccsrv3.epfl.ch domain,
      // you might need to configure `server.origin` or look into HMR proxying.
      // But let's start with just `host: true` and `https`.
    };
  } else {
    // Build specific configuration
    return {
      ...commonConfig,
      build: {
        // outDir: 'dist', // Default
        // sourcemap: true, // For production sourcemaps
        // ... other build options
      },
    };
  }
});
