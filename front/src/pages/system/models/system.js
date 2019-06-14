import { 
  GetSystemCrontabLogsApi,
  } from '../../../services/api';
  
  export default {
      names: 'system',
      state:{
       
      },
      
      effects: {
        // 获取组列表
        *getSystemCronLogs({ payload,callback  }, { call }) {
          const data = yield call(GetSystemCrontabLogsApi,payload)
          if(data){
              callback(data)
          }
        },
      },
      reducers: {
  
      },
    }