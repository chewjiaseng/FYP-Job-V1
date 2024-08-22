const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/pred': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
};

