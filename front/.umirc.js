import {resolve} from "path";
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  outputPath: "output",
  hash:true,
  // history: 'hash',
  ignoreMomentLocale: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      // chunks: ['umi'],
      // chunks: ['vendors', 'default.cmdb',  'cmdb'],
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
    cmdbstore: resolve(__dirname,'./src/utils/store'),
    requestapi: resolve(__dirname,'./src/utils/request') ,
  },
  theme: {
    "primary-color": "#1DA57A",
    'border-radius-base': '3px',
    'link-color': '#1DA57A',
    'error-color': '#f5222d',
    'layout-header-height': '54px',
    'layout-header-background': '#fcfcfdcc',
    'layout-header-padding':"0px",
    'layout-sider-background':"#1da57a",
    'tabs-title-font-size':'14px',
    'switch-sm-height':'18px',
    'tabs-bar-margin':'0px -px 8px 0px'
  },
  proxy: {
    "/api": {
      "target": "http://127.0.0.1:8000/api",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
}
