import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],   // entry React
            refresh: true,
        }),
        react(),
    ],

    resolve: {
        alias: {
            "@": "/resources/js/src",   // biar import komponen lebih clean
        },
    },

    server: {
        port: 5173,
        strictPort: true,
    },
})
