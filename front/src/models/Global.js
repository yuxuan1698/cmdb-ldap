import { getLDAPObjectClassList } from '../services/api';
import { Modal } from 'antd';
export default {
    namespace: 'global',
    state: {
      smallSideBar:false,
      isAdmin:false,
      languages: navigator.language,
      classobjects:""
    },
    subscriptions: {
      setup({ history }) {
        history.listen(() => {
          Modal.destroyAll();
        })
      }
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
      // *changeLanguage({ }, { call,put }) {
      //   const data = yield call(getLDAPObjectClassList)
      //   if (data) {
      //     yield put({
      //       type:'classobjects', 
      //       payload: {
      //         classobjects: data,
      //       }
      //     })
      //   }
      // },
    },
    reducers: {
      // LDAP classObjects
      classobjects(state, {payload} ) {
        return {...state,...payload}
      },
    }
  }
