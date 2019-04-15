export default {
    namespace: 'login',
    state: {islogin: false, userinfo: ''},
    subscriptions: {
      setup({ dispatch, history }) {
      },
    },
    effects: {
  
    },
    reducers: {
      changeLoginStatus(state, {payload}) {
        return {...state, ...payload}
      }
    },
  };
  