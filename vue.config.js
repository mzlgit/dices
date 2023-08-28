const path = require('path')
const { defineConfig } = require('@vue/cli-service')
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.rmonl.com/',
        ws: true,
        changeOrigin: true
      },
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  configureWebpack: {
    // 优化
    optimization: {
      minimizer: [
        // 代码
        new UglifyJsPlugin({
          uglifyOptions: {
            output: { 
              // 删除注释
              comments: false
            },
            //生产环境自动删除console
            compress: {
              drop_debugger: true,  //清除 debugger 语句
              // drop_console: true,   //清除console语句
              // pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      ]
    },
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  },
})

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/mixins.scss'),
      ],
    })
}