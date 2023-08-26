module.exports = () => ({
  plugins: {
    'postcss-url': {},
    'postcss-write-svg': {
      utf8: false
    },
    'postcss-cssnext': {
      features: {
        customProperties: {
            warnings: false // 关闭警告
        }
      }
    },
    cssnano: {
      preset: ['advanced'] // 默认，关闭autoprefixer， 防止重名keyiframes，防止重置zindex
    },
    'postcss-px-to-viewport': {
      viewportWidth: 1920, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      // viewportHeight: 1080, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 4, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: true, // 允许在媒体查询中转换`px`
    }
    // 'postcss-pxtorem': {
    //   rootValue: 10, // 
    //   propList: ['*'], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
    // }
  }
});
