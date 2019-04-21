
// import { browserHistory } from 'dva/router'
// import createLoading from 'dva-loading';
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
    // initialState:{
    //   login:{islogin:false,userinfo:"",failtime:""},
    //   global:{smallSideBar:false,isAdmin:false,collapse}
    // },
  },
  plugins: [
    require('dva-logger')(),
  ],
};
