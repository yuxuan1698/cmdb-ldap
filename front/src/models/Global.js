import { getLDAPObjectClassList,GetAliCloundCerificateCountApi,GetAliCloundDomainListApi } from '../services/api';
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
      *loadAllStatus({ callback }, { call }) {
        const data = yield call(GetAliCloundCerificateCountApi)
        if (data) {
          callback(data)
        }
      },
      *getAliyunDomainList({ callback }, { call }) {
        const data = yield call(GetAliCloundDomainListApi)
        if (data) {
          callback(data)
        }
      },
    },
    reducers: {
      // LDAP classObjects
      classobjects(state, {payload} ) {
        return {...state,...payload}
      },
    }
  }
