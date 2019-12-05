
// import { browserHistory } from 'dva/router'
// import createLoading from 'dva-loading';
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
  plugins: [
    // require('dva-logger')(),
  ],
};
