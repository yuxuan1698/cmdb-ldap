
// import { browserHistory } from 'dva/router'
// import createLoading from 'dva-loading';
export const dva = {
  // history: 'memory',
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
    initialState:{
      login:{islogin:false,userinfo:"",md5:""}
    },
  },
  plugins: [
    require('dva-logger')(),
  ],
};
