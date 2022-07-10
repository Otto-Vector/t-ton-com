import {createProxyMiddleware} from 'http-proxy-middleware'
// export const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function ( app: any ) {
    app.use(
        createProxyMiddleware('/api/**', {
                target: 'https://server.t-ton.com',
                secure: false,
                changeOrigin: true,
            }
        )
    )
}


// export const text_test = ''
