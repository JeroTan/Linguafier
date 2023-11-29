import { defineConfig } from 'vite';  ///Kailangan Please PAKILAGAY
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; ///Kailangan Please PAKILAGAY

export default defineConfig({
    plugins: [
        react(), // React plugin that we installed for vite.js
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
    ],
});
