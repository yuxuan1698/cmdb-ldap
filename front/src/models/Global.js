import { getLDAPObjectClassList } from '../services/api';
export default {
    namespace: 'global',
    state: {
      smallSideBar:false,
      isAdmin:false,
      languages:'zh-CN',
      classobjects:""
    },
    subscriptions: {
      
    },
    effects: {
      *getLDAPClassList({ callback }, { call,put }) {
        const data = yield call(getLDAPObjectClassList)
        if (data) {
          yield put({
            type:'classobjects', 
            payload: {
              classobjects: data,
            }
          })
        }
      },
    },
    reducers: {
    // LDAP classObjects
    classobjects(state, {payload} ) {
      return {...state,...payload}
      },
    },
  }
