
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  outputPath: "output",
  hash:true,
  ignoreMomentLocale: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      chunks: ['umi'],
      // chunks: ['vendors', 'default.cmdb',  'cmdb'],
      dynamicImport: { webpackChunkName: true },
      title: 'CMDB-LDAP Manager',
      dll: true,
      locale: {
        enable: true,
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
  "theme": {
    "primary-color": "#1DA57A",
    'border-radius-base': '2px',
    'link-color': '#1DA57A',
  },
  "proxy": {
    "/api": {
      "target": "http://127.0.0.1:8000/api",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      }
    });
  }
}
