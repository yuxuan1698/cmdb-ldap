import { 
  getGroupList
} from '../../../services/api';

export default {
    names: 'ldap',
    state:{
      groups:{}
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          switch(location.pathname){
            case '/user/ldap/':
              dispatch({
                type: 'getLDAPGroupsList'
              })
              break;
          }
        });
      },
    },
    effects: {
      *getLDAPGroupsList({ payload }, { call,put }) {
        const data = yield call(getGroupList, payload)
        if (data) {
          yield put({
            type:'ldapgroupslist', 
            payload: {
              groups: data,
            }
          })
        }
      },
    },
    reducers: {
      // 组列表
      ldapgroupslist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }