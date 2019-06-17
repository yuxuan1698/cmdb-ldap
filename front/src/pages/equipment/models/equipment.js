import { 
    GetAliCloundEcsListApi,
    GetAliCloundRegionsListApi
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
      },
      reducers: {
       
      },
    }