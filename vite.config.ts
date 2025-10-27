import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import path from 'path'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     // Accept external connections (LAN + tunnels)
//     host: true,

//     // Let the CloudPub hostname through
//     allowedHosts: [
//       'invisibly-vivacious-dunnock.cloudpub.ru',
//       // if CloudPub rotates hosts for you, keep the wildcard; otherwise remove it
//       '*.cloudpub.ru',
//     ],

//     // If your CloudPub URL is HTTPS (very likely), HMR needs to talk back over wss:443
//     // If HMR already works for you without this, you can remove this block.
//     hmr: {
//       host: 'invisibly-vivacious-dunnock.cloudpub.ru',
//       protocol: 'wss',
//       clientPort: 443,
//     },
//   },
// })
