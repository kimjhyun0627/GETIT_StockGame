// setupProxy.ts

import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080', // Replace with your server URL
            changeOrigin: true,
            pathRewrite: {
                '^': '', // Remove /api prefix when forwarding to the server
            },
        })
    );
}