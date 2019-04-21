import { UserChangePassword } from '../services/api';
export default {
    namespace: 'global',
    state: {
      smallSideBar:false,
      isAdmin:false,
      languages:'zh-CN'
    },
    subscriptions: {
      
    },
    effects: {
      *changePasswordAction({ payload, callback }, { call }) {
        // console.log(payload)
        const data = yield call(UserChangePassword, payload)
        callback(data)
      }
      
    },
    reducers: {
      
    },
  }
