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
  static base64Decode(val){
    try {
      const base64DecodeStr = new Buffer.from(val,'base64').toString();
      try{
        const value = JSON.parse(base64DecodeStr);
        return value
      }catch(error){
        return base64DecodeStr
      }
    } catch (error) {
     return false
    }
  }
  static base64Encode(val){
    if(typeof(val)==="string"){
      return new Buffer.from(val).toString('base64')
    }
    if (typeof (val) ==='object'){
      return new Buffer.from(JSON.stringify(val)).toString('base64')
    }
    return false
  }
  static getCookie(name){
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    const arr = document.cookie.match(reg);
    if (arr) {
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  }
  // 设置COOKIE
  static setCookie(name,value,expires){
    let currTime=new Date()
    currTime.setTime(currTime.getTime()+expires)
    document.cookie = `${name}=${this.base64Encode(value)}${expires ? ";expires=" + currTime.toGMTString():""}`
  }
  static delCookie(name,domain,path){
    if (this.get(name)) {
      document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + 
                        path + '; domain=' + 
                        domain;
    }
  }
  // 获取LOCAL键值
  static getLocal(key,decode=true){
    let base64DecodeVal=""
    if(decode){
      base64DecodeVal = this.base64Decode(localStorage.getItem(key));
    }else{
      base64DecodeVal = localStorage.getItem(key);
    }
    if(base64DecodeVal){
      return base64DecodeVal
    }else{
      return false  
    }
  }
  // 设置LOCAL存储
  static setLocal(key,value){
    const base64Encode = this.base64Encode(value)
    return localStorage.setItem(key, base64Encode);
  }
  // 删除local存储
  static delLocal(key){
    return localStorage.removeItem(key);
  }
}