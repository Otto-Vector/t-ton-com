const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // app.use(
    //     createProxyMiddleware('/api/**', {
    //             target: 'https://server.t-ton.com',
    //             // secure: false,
    //             changeOrigin: true,
    //         },
    //     ),
    // )
    // app.use(
    //     createProxyMiddleware('/v1/**', {
    //             target: 'https://api.avtodispetcher.ru',
    //             changeOrigin: true,
    //         },
    //     ),
    // )
    // app.use(
    //     createProxyMiddleware('/suggestions/**', {
    //             target: 'https://suggestions.dadata.ru',
    //             changeOrigin: true,
    //         },
    //     ),
    // )
}