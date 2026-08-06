/**
 * Taro 配置（W2 mobile-ui）
 * 编译目标：微信小程序（taro build --type weapp）
 * NutUI 京东默认主题用我方 tokens 覆盖在 src/styles/globals.css 的 --nutui-* 变量映射完成，
 * 不在此处注入 sass，避免构建期依赖 NutUI 内部 scss 路径。
 */
module.exports = {
  projectName: 'techmation-mobile-ui',
  date: '2026-07-30',
  designWidth: 375,
  deviceRatio: {
    375: 2,
    750: 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      cssModules: { enable: false },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: { enable: true },
      cssModules: { enable: false },
    },
  },
};
