import { 
  UserChangePassword,
  getLDAPUserList,
  PostLDAPDeleteUser,
  PostLDAPCreateUser,
  PostLDAPUpdateUser,
  getLDAPUserAttribute,
  getLDAPObjectClassList
} from '../../../services/api';

export default {
    names: 'users',
    state:{
      userlist:{}
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          switch(location.pathname){
            case '/user/':
              dispatch({
                type: 'getUserList'
              })
              break;
          }
        });
      },
    },
    effects: {
      *changePasswordAction({ payload, callback }, { call }) {
        const data = yield call(UserChangePassword, payload)
        if (data && callback && typeof callback === 'function') {
          callback(data); // 返回结果
        }
      },
      *getUserList({ payload }, { call,put }) {
        const data = yield call(getLDAPUserList, payload)
        if (data) {
          yield put({
            type:'userlist', 
            payload: {
              userlist: data,
            }
          })
        }
      },
      *getUserAttribute({ payload,callback }, { call }) {
        const data = yield call(getLDAPUserAttribute,payload)
        if (data) {
          callback(data)
        }
      },
      *getLDAPClassList({ callback }, { call }) {
        const data = yield call(getLDAPObjectClassList)
        if (data) {
          callback(data)
        }
      },
      *postLDAPCreateUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPCreateUser,payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPUpdateUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPUpdateUser,payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPDeleteUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPDeleteUser,payload)
        if (data) {
          callback(data)
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