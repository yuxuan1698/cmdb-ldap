import { Store } from "./store";
export function GenerateRequestAuthParams() {
  const header_info=Store.getLocal('userinfo');
  let header={}
    if (header_info.hasOwnProperty('token_prefix') &&
        header_info.hasOwnProperty('token') && 
        header_info.token!==""){
      header['Authorization'] = `${header_info['token_prefix']} ${header_info['token']}`
      header['Content-Type'] ='application/json'
      return {headers:header}
    }
    return false
}