import { UserChangePassword,UserList } from '../../../services/api';
export default {
    names: 'users',
    state:{
      userlist:{},
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname.match('^/user/$')) {
            dispatch({
              type: 'getUserList'
            })
          }
        });
      },
    },
    effects: {
      *changePasswordAction({ payload, callback }, { call }) {
        // console.log(payload)
        const data = yield call(UserChangePassword, payload)
        if (data && callback && typeof callback === 'function') {
          callback(data); // 返回结果
        }
      },
      *getUserList({ payload }, { call,put }) {
        const data = yield call(UserList, payload)
        if (data) {
          yield put({
            type:'userlist', 
            payload: {
              userlist: data,
            }
          })
        }
      },
    },
    reducers: {
      // 用户表列
      userlist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }