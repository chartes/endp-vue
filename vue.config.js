/*
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

*/

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? "/dev" : "/",
  devServer: {
    proxy: 'http://localhost:9091'
  }
}