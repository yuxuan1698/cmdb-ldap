import { 
  UserChangePassword,
  getGroupList,
  getLDAPUserList,
  getLDAPObjectClassList,
  PostLDAPCreateUser
} from '../../../services/api';

export default {
    names: 'users',
    state:{
      userlist:{},
      groups:{}
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          console.log(location.pathname)
          switch(location.pathname){
            case '/user/':
              dispatch({
                type: 'getUserList'
              })
              break;
            case '/user/groups/':
              dispatch({
                type: 'getGroupsList'
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
      *getGroupsList({ payload }, { call,put }) {
        const data = yield call(getGroupList, payload)
        if (data) {
          yield put({
            type:'groupslist', 
            payload: {
              groups: data,
            }
          })
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
    },
    reducers: {
      // 用户表列
      userlist(state, {payload} ) {
        return {...state,...payload}
      },
      // 组列表
      groupslist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }