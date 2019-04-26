import { 
  getGroupList
} from '../../../services/api';

export default {
    names: 'groups',
    state:{
      groups:{}
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          switch(location.pathname){
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
    },
    reducers: {
      // 组列表
      groupslist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }