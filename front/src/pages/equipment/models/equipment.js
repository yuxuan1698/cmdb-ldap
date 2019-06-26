import { 
    GetAliCloundEcsListApi,
    GetAliCloundRegionsListApi,
    GetAliCloundTagsListApi,
    GetAliCloundCerificateListApi,
    GetAliCloundCerificateInvalidApi
  } from '../../../services/api';
  
  export default {
      names: 'equipment',
      state:{
        
      },
      effects: {
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
       
      },
    }