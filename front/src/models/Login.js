import {userlogin} from '../services/login';
import { Store } from '../utils/store'
import router from 'umi/router';
export default {
    namespace: 'login',
    state: {
      islogin: false, 
      userinfo: {},
      historyPath: "",
      historyParse: {},
      permissions:{},

    },
    subscriptions: {
      setupHistory({ dispatch, history }) {
        history.listen(location => {
          dispatch({
            type: 'updateLocation',
            payload: {
              historyPath: location.pathname,
              historyParse: location.query,
            },
          })
        })
      },
      setup({ dispatch,history }) {
        const data = Store.getLocal('userinfo');
        if (!data || !(data.hasOwnProperty('token') && data.token!="")) {
          dispatch({
            type: 'logout',
            payload: {userinfo:""},
          });
          const {pathname} = history.location
          let query={}
          if(!pathname.match('^/login|^/$')){
            query={from:pathname }
          }
          router.push({
            pathname:'/login',
            query: query
          })
        } else {
          dispatch({
            type: 'login',
            payload: {
              userinfo: data,
            },
          });
          if(history.location.pathname.match('^/login')){
            router.push('/')
          }
        }
      } 
    },
    effects: {
      *loginAction({payload,callback},{call,put,select}){
        const data = yield call(userlogin, payload)
        // const { historyPath } = yield select(_ => _.login)
        if(data && data.hasOwnProperty('token')){
          Store.setLocal('userinfo',data)
          yield put({
            type:'login',
            payload: {
              userinfo: data,
            }
          })
          if (callback && typeof callback === 'function') {
            callback(data); // 返回结果
          }
        }
      },
      *logoutAction({payload},{call,put,select}){
        // const data = yield call(userlogin, payload)
        // if(data && data.hasOwnProperty('token')){
        Store.delLocal('userinfo')
        yield put({
          type:'logout',
          payload: {
            userinfo: "",
          }
        })
      },
    },
    reducers: {
      // 登陆
      login(state, {payload} ) {
        return {...state, islogin: true,...payload}
      },
      // 注销
      logout(state,{payload}){
        return {...state,islogin:false, userinfo:""}
      },
      // 更新location
      updateLocation(state,{payload}){
        return {...state,...payload}
      },
    },
  }
