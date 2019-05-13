import { 
  getGroupList,
  PostLDAPDNUpdate
} from '../../../services/api';

export default {
    names: 'ldap',
    state:{
      groups:{
        treedata:[],
        treeobject:{},
      }
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          switch(location.pathname){
            case '/user/ldap':
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
          let newdata = { treedata:[],treeobject:{}}
          Object.keys(data).map(i => {
            let titlefield=data[i][1].split(',')[0].split('=')[0]
            newdata['treedata'].push({ title: data[i][0][titlefield][0], key: data[i][1] })
            newdata['treeobject'][data[i][1]] = data[i][0]
          })
          yield put({
            type:'ldapgroupslist', 
            payload: {
              groups: newdata,
            }
          })
        }
      },
      *getLDAPGroupsSecendList({ payload,callback }, { call }) {
        const data = yield call(getGroupList, payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPDNUpdate({ payload,callback }, { call }) {
        const data = yield call(PostLDAPDNUpdate, payload)
        if (data) {
          callback(data)
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