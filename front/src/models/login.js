import {userlogin} from '../pages/login/services/login';
import {setLocalStorage,getLocalStorage} from '../utils/store'
import { routerRedux } from 'dva/router';
export default {
    namespace: 'login',
    state: {islogin: false, userinfo: {}},
    subscriptions: {
      // setup({ dispatch, history,query }) {
      // },
      setup({ dispatch,history }) {
        const data = getLocalStorage('userinfo');
        if (!data) {
          dispatch({
            type: 'logout',
            payload: {userinfo:""},
          });
          dispatch(routerRedux.push({
            pathname:'/login'
          }))
        } else {
          dispatch({
            type: 'login',
            payload: {
              userinfo: data,
            },
          });
          if(history.location.pathname.match('^/login')){
            dispatch(routerRedux.push({
              pathname:'/'
            }))
          }
          // console.log(history)
          // dispatch(routerRedux({}))
          // history.listen(( pathname ) => {
          //   console.log(pathname)
          // })
        }
      }
    },
    effects: {
      *loginHandle({payload,callback},{call,put,select}){
        const data = yield call(userlogin, payload)
        if(data && data.hasOwnProperty('token')){
          setLocalStorage('userinfo',data)
          yield put({type:'login',userinfo: data})
          if (callback && typeof callback === 'function') {
            callback(data); // 返回结果
          }
        }
      }
    },
    reducers: {
      // 登陆
      login(state, {payload} ) {
        return {...state, islogin: true,...payload}
      },
      // 注销
      logout(state,{payload}){
        return {...state,islogin:false, userinfo:""}
      }
    },
  }
