
import { browserHistory } from 'dva/router'
// import createLoading from 'dva-loading';
export const dva = {
  history: browserHistory,
  // use: createLoading(),
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
  plugins: [
    require('dva-logger')(),
  ],
};
