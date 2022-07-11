const { createProxyMiddleware } = require('http-proxy-middleware');

const { REACT_APP_DEPLOY_MODE } = process.env

module.exports = function (app) {
    if (REACT_APP_DEPLOY_MODE === 'false') {
        app.use(
            createProxyMiddleware('/api/**', {
                    target: 'https://server.t-ton.com',
                    // secure: false,
                    changeOrigin: true,
                },
            ),
        )
        app.use(
            createProxyMiddleware('/v1/**', {
                    target: 'https://api.avtodispetcher.ru',
                    changeOrigin: true,
                },
            ),
        )
        app.use(
            createProxyMiddleware('/suggestions/**', {
                    target: 'https://suggestions.dadata.ru',
                    changeOrigin: true,
                },
            ),
        )
    }
}
