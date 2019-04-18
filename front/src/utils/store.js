// Replace Status text
export function getUserStatus(status) {
  if (status === 1) {
    return { status: 'success', text: '正常' };
  } else {
    return { status: 'default', text: '禁用' };
  }
}

export function getIsAdminStatus(status) {
  if (status === 1) {
    return { status: 'success', text: '是' };
  } else {
    return { status: 'default', text: '否' };
  }
}

// Operation LocalStorage and Cookie
export class Store {
  static getCookie(name){
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    const arr = document.cookie.match(reg);
    if (arr) {
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  }
  static delCookie(name,domain,path){
    if (this.get(name)) {
      document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + 
                        path + '; domain=' + 
                        domain;
    }
  }
  static getLocal(key){
    try {
      const base64Decode = new Buffer(localStorage.getItem(key),'base64').toString();
      const value = JSON.parse(base64Decode);
      return value
    } catch (error) {
     return false
    }
  }
  static setLocal(key,value){
    const base64Encode=new Buffer(JSON.stringify(value)).toString('base64')
    return localStorage.setItem(key, base64Encode);
  }
}