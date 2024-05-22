
/*
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})*/


module.exports = {
  devServer: {
    port: 9091,
  },
  // publicPath: process.env.NODE_ENV === 'production' ? "/endp" : "/"
  publicPath: process.env.NODE_ENV === 'production' ? "/" : "/"
}