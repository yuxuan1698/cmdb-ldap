import {userlogin} from '../services/login';
import { Store } from 'cmdbstore'
import router from 'umi/router';
import {isLoginStatus,isNotAuthChangerPassword} from 'utils'
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
        const {pathname,query} = history.location
        let args={}
        if(!pathname.match('^/login|^/$')){
          args={from:pathname,...query }
        }
        if (isLoginStatus(data)) {
          dispatch({
            type: 'login',
            payload: {
              userinfo: data,
            },
          });
          if(pathname.match('^/login')){
            router.push('/')
          }
        } else {
          if(!isNotAuthChangerPassword(history.location)){
            dispatch({
              type: 'logout',
              payload: {userinfo:""},
            });
            router.push({
              pathname:'/login',
              query: args
            })
          }
        }
      } 
    },
    effects: {
      *loginAction({payload,callback},{call,put}){
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
          if (data && callback && typeof callback === 'function') {
            callback(data); // 返回结果
          }
        }
      },
      *logoutAction({payload},{put}){
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
