import { 
    GetAliCloundEcsListApi,
    GetAliCloundEcsMonitorDataListApi,
    GetAliCloundRegionsListApi,
    GetAliCloundTagsListApi,
    GetAliCloundCerificateListApi,
    GetAliCloundCerificateInvalidApi,
    GetAliCloundAccountNameListApi
  } from '../../../services/api';
  
  export default {
      names: 'equipment',
      state:{
        aliAccount:[],
        currAccount:"wbd"
      },
      subscriptions: {
        setup({dispatch}) {
          dispatch({
            type: 'setAliCloundAliAccountNameList'
          })
        }
      },
      effects: {
        *setAliCloundAliAccountNameList({ }, { call,put }) {
          const data = yield call(GetAliCloundAccountNameListApi)
          if (data) {
            yield put({
              type:'updateAliAccountNamelist',
              payload: {
                aliAccount: Object.values(data),
              }
            })
          }
        },
        *setAliCloundAlicurrAccountName({ payload }, { put }) {
          yield put({
            type:'updateAlicurrAccountName',
            payload: {
              currAccount: payload,
            }
          })
        },
        *getAliCloundRegionsList({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundRegionsListApi, payload)
          if (data) {
            callback(data)
          }
        },
        *getAliCloundEcsList({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundEcsListApi, payload)
          if (data) {
            callback(data)
          }
        },
        *getAliCloundEcsMonitorDataList({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundEcsMonitorDataListApi, payload)
          if (data) {
            callback(data)
          }
        },
        *getAliCloundTagsList({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundTagsListApi, payload)
          if (data) {
            callback(data)
          }
        },
        *getAliCloundCerificateList({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundCerificateListApi, payload)
          if (data) {
            callback(data)
          }
        },
        *getAliCloundCerificateInvalid({ payload,callback }, { call }) {
          const data = yield call(GetAliCloundCerificateInvalidApi, payload)
          callback(data)
        },
      },
      reducers: {
        // 更新aliAccount
        updateAliAccountNamelist(state,{payload}){
          return {...state,...payload}
        },
        // 更新currAccount
        updateAlicurrAccountName(state,{payload}){
          return {...state,...payload}
        },
      },
    }