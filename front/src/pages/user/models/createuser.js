import { 
  PostLDAPCreateUser
} from '../../../services/api';

export default {
    names: 'createuser',
    state:{
      groups:{}
    },
    subscriptions: {
      setup({ dispatch, history }) {
        
      },
    },
    effects: {
      *postLDAPCreateUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPCreateUser,payload)
        if (data) {
          callback(data)
        }
      },
    },
    reducers: {
      // 组列表
      groupslist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }