// vue.config.js
// const config = require('config');

module.exports = {
    chainWebpack: (config) => {
        config.resolve.symlinks(false)
    },
    // options...
    devServer: {
        useLocalIp: false,
        public: 'http://localhost/:8080',
        disableHostCheck: true,
        proxy: {
            '^/api': {
                target: 'http://localhost:3000',
            },
        },
    }
}