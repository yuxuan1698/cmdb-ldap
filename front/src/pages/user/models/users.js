import { 
  UserChangePassword,
  UserResetPassword,
  getLDAPUserList,
  PostLDAPDeleteUser,
  PostLDAPCreateUser,
  PostLDAPUpdateUser,
  getLDAPUserAttribute,
  PostLDAPLockUnLockUser,
  getUserPermissionList,
  getLDAPObjectClassList,
  GetSSHKeyPrivateAndPublicKeyApi
} from '../../../services/api';

export default {
    names: 'users',
    state:{
      userlist:{},
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          switch(location.pathname){
            case '/user':
              dispatch({
                type: 'getUserList'
              })
              break;
          }
        });
      },
    },
    effects: {
      *changePasswordAction({ payload, callback }, { call }) {
        const data = yield call(UserChangePassword, payload)
        if (data && callback && typeof callback === 'function') {
          callback(data); // 返回结果
        }
      },
      *resetPasswordAction({ payload, callback }, { call }) {
        const data = yield call(UserResetPassword, payload)
        if (data && callback && typeof callback === 'function') {
          callback(data); // 返回结果
        }
      },
      *getUserList({ payload }, { call,put }) {
        const data = yield call(getLDAPUserList, payload)
        if (data) {
          yield put({
            type:'userlist', 
            payload: {
              userlist: data,
            }
          })
        }
      },
      *getUserAttribute({ payload,callback }, { call }) {
        const data = yield call(getLDAPUserAttribute,payload)
        if (data) {
          callback(data)
        }
      },
      *getLDAPClassList({ callback }, { call }) {
        const data = yield call(getLDAPObjectClassList)
        if (data) {
          callback(data)
        }
      },
      *postLDAPCreateUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPCreateUser,payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPUpdateUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPUpdateUser,payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPDeleteUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPDeleteUser,payload)
        if (data) {
          callback(data)
        }
      },
      *postLDAPLockUnlockUser({ payload,callback }, { call }) {
        const data = yield call(PostLDAPLockUnLockUser,payload)
        if (data) {
          callback(data)
        }
      },
      *getLDAPUserPermissions({ payload,callback }, { call }) {
        const data = yield call(getUserPermissionList,payload)
        if (data) {
          callback(data)
        }
      },
      *generateSSHKeyAndDownLoad({ payload,callback }, { call }) {
        const data = yield call(GetSSHKeyPrivateAndPublicKeyApi,payload)
        if (data) {
          // 下载私钥程序段
          if(data.hasOwnProperty('privatekey')){
            let privateObj = new Blob([data.privatekey],{type:'application/x-x509-ca-cert'})
            let PrivateElement = document.createElement('a')
            //创建下载的对象链接
            let DownloadHref = window.URL.createObjectURL(privateObj); 
            // PrivateElement.style.display="none"
            PrivateElement.href = DownloadHref;
            //下载的文件名以用户名命名
            PrivateElement.download = `${payload.username}-private.pem`; 
            document.body.appendChild(PrivateElement);
            //点击下载
            PrivateElement.click(); 
            //下载完成移除元素
            document.body.removeChild(PrivateElement); 
            window.URL.revokeObjectURL(DownloadHref);
          }
          callback(data)
        }
      },
    },
    reducers: {
      // 用户表列
      userlist(state, {payload} ) {
        return {...state,...payload}
      },
    },
  }