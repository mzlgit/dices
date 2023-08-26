module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
	? './'
	: '/',
	devServer: {
    proxy: {
      '/api': {
        target: 'http://www.rmonl.com/',
        ws: true,
        changeOrigin: true
      },
      '/Home': {
        target: 'http://www.rmonl.com/',
        ws: true,
        changeOrigin: true
      },
    }
  },
  chainWebpack: (config) => {
		const oneOfsMap = config.module.rule('scss').oneOfs.store
		oneOfsMap.forEach((item) => {
			item.use('sass-resources-loader')
				.loader('sass-resources-loader')
				.options({
					// 引入一个全局sass文件
					// resources: './src/assets/styles/common.scss',
					// 引入多个全局sass文件
					resources: [
						'./src/style/var.scss',
						'./src/style/mixins.scss',
					],
				})
				.end()
		})
	}
}