import { 
  getGroupList,
  PostLDAPUpdateDN,
  PostLDAPDeleteDN,
  PostLDAPCreateDN
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
      // 获取组列表
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
      // 更新DN
      *postLDAPUpdateDN({ payload,callback }, { call }) {
        const data = yield call(PostLDAPUpdateDN, payload)
        if (data) {
          callback(data)
        }
      },
      // 创建DN
      *postLDAPCreateDN({ payload,callback }, { call }) {
        const data = yield call(PostLDAPCreateDN, payload)
        if (data) {
          callback(data)
        }
      },
      // 删除DN
      * deleteEntryDn({ payload, callback }, { put, call, select }) {
        let treedata = yield select(({ ldap }) => ldap.groups.treedata)
        
        const resp = yield call(PostLDAPDeleteDN, {
          currentDn: payload
        })
        if(resp){
          const newtreedata = treedata.filter(i => {
            return i.key != payload ? true : false
          })
          if(newtreedata){
            yield put({
              type: 'ldapdeletedn',
              payload: {
                groups: {
                  treedata: newtreedata
                },
              }
            })
          }
          callback(resp)
        }
      },
      *addNewEntryDN({ payload }, { put,select }) {
        let tempList = yield select(({ldap}) => ldap.groups.treedata)
        if(payload){
          tempList.map(i=>{
            if(i.key===payload){
              i['children']=[{title:"newDn",key:"newDn"}]
            }
          })
        }else{
          tempList.unshift({title:"newDn",key:"newDn"})
        }
        yield put({
          type:'ldapcreatedn', 
          payload: {
            groups: {treedata:tempList},
          }
        })
      },
    },
    reducers: {
      // 组列表
      ldapgroupslist(state, {payload} ) {
        return {...state,...payload}
      },
      // 新建/添加dn
      ldapcreatedn(state, {payload} ) {
        return {...state,...payload}
      },
      // 删除dn
      ldapdeletedn(state, {payload} ) {
        console.log(payload)
        return {...state,...payload}
      },
    },
  }