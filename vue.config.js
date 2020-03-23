// vue.config.js
module.exports = {
    // options...
    devServer: {
        useLocalIp: false,
        public: 'http://34.217.130.141/:8080',
        disableHostCheck: true,
        proxy: {
            '^/api': {
                target: 'http://54.189.156.158:3000',
            },
        },
    }
}