// vue.config.js
const config = require('config');

module.exports = {
    // options...
    devServer: {
        useLocalIp: false,
        public: config.get('public') || 'http://localhost/:8080',
        disableHostCheck: true,
        proxy: {
            '^/api': {
                target: config.get('api') || 'http://localhost:3000',
            },
        },
    }
}