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

// Operation Cookie
export function getCookie(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}

export function delCookie({ name, domain, path }) {
  if (getCookie(name)) {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + 
                      path + '; domain=' + 
                      domain;
  }
}

// Operation LocalStorage
export function setLocalStorage(key, vaule) {
  const base64Encode=new Buffer(JSON.stringify(vaule)).toString('base64')
  return localStorage.setItem(key, base64Encode);
}

export function getLocalStorage(key) {
  try {
    const base64Decode = new Buffer(localStorage.getItem(key),'base64').toString();
    const value = JSON.parse(base64Decode);
    if(value.hasOwnProperty('token')){
      return value
    }else{
      return false
    }
  } catch (error) {
  //  console.log(error)
   return false
  }
}