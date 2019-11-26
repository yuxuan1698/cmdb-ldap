import {resolve} from "path";
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  base: "/cmdb", 
  outputPath: "output/cmdb",
  publicPath: "/cmdb/",
  runtimePublicPath: true,
  hash:true,
  ignoreMomentLocale: true,
  ignoreMomentLocale: true,
  urlLoaderExcludes: [/\.svg$/],
  chainWebpack(config, { webpack }) {
    config.module
      .rule('svg')
      .test(/.svg(\?v=\d+.\d+.\d+)?$/)
      .use([
        {
          loader: 'babel-loader'
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true
          }
        }
      ])
      .loader(require.resolve('@svgr/webpack'))
      .options({
        name: 'svg/[name]-[hash:8].[ext]'
      });
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      chunks: ['vendors', 'umi'],
      dynamicImport: { webpackChunkName: true },
      title: 'CMDB-LDAP Manager',
      dll: true,
      locale: {
        enable: true,
        baseNavigator:true,
        default: 'zh-CN',
        antd: true
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  alias:{
    utils: resolve(__dirname,'./src/utils/utils'),
    ldaplint: resolve(__dirname,'./src/utils/ldaplint'),
    cmdbstore: resolve(__dirname,'./src/utils/store'),
    api: resolve(__dirname,'./src/services/api'),
    requestapi: resolve(__dirname,'./src/utils/request'),
    svgicon: resolve(__dirname,'./src/static/svgicon/'),
  },
  theme: {
    "primary-color": "#1DA57A",
    'border-radius-base': '2px',
    'link-color': '#1DA57A',
    'error-color': '#f5222d',
    'layout-header-height': '54px',
    'layout-header-background': '#fcfcfdcc',
    'layout-header-padding':"0px",
    'layout-sider-background':"#1da57a",
    'tabs-title-font-size':'14px',
    'switch-sm-height':'18px',
    'tabs-bar-margin':'0px -px 8px 0px',
    'table-border-radius-base':0,
    'table-header-bg':'#e8e8e8',
    'popover-bg':'#fbfbfb',
    'popover-arrow-width':'8px',
    'tooltip-max-width':"450px",
    'tooltip-arrow-width':"7px",
    'card-head-padding':"8px",
    'card-padding-base':'16px',
    'slider-margin':'4px 10px'
  },
  proxy: {
    "/api": {
      "target": "http://172.16.1.140:8000/api",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
}
