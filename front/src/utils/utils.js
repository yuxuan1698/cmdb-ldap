export function GenerateRequestHeaderParams(header_info) {
    let header={}
    if (header_info.hasOwnProperty('token_prefix') &&
        header_info.hasOwnProperty('token') && 
        header_info.token!==""){
      header['Authorization'] = `${header_info['token_prefix']} ${header_info['token']}`
      return header
    }
    return false
}