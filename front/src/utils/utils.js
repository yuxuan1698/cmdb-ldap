import { Store } from "./store";
import { notification,message,Alert,Icon } from 'antd';
import {formatMessage} from 'umi/locale';
import moment from 'moment'
import md5 from 'js-md5'

let errTitle=''
// 生成认证请求头
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

// 格式化输出返回错误信息
export function formatReturnMsg(msgObj,status){
  let errorMsg=""
  switch(status){
    case 401:
      errorMsg=Object.keys(msgObj).map(i=>msgObj[i])
      message.warn(`${formatMessage({ id: 'request.status.401' })} ${errorMsg}`)
      break;
    case 400:
      errorMsg=Object.keys(msgObj).map(i=>{
        if(typeof(msgObj[i])==='object' && !(msgObj[i] instanceof Array)){
          return  Object.keys(msgObj[i]).map(v=>{
                    if(msgObj[i][v] instanceof Array){
                      return <div key={v}><Icon type="exclamation-circle" theme="twoTone" />{msgObj[i][v][0]} </div>
                    }
                    return <div key={v}><Icon type="exclamation-circle" theme="twoTone" />{v.toLocaleUpperCase()}:{msgObj[i][v]} </div>
                  })
        }
        return <Alert key={i} style={{margin:"3px 0"}} message={`${i}:${msgObj[i]}`} type="error" />
      })
      notification.error({
        message:formatMessage({id:'cmdb.error'}),
        description: errorMsg
      })
      break;
    case 504:
      errorMsg=formatMessage({ id: 'request.status.' + status })
      message.error(`${errorMsg}${formatMessage({ id: 'request.status' })}${status}`)
      break;
    default:
      errorMsg=formatMessage({ id: 'request.status.other'  })
      message.error(`${errorMsg}${formatMessage({ id: 'request.status' })}${status}`)
  }

}


// 单个list值转string
export function singleListToString(objval){
  if(objval instanceof Object){
    Object.keys(objval).map(i=>{
      if(objval[i] instanceof Object && !objval[i] instanceof Array) objval[i]=singleListToString(objval[i])
      if(objval[i] instanceof Array){
        if(objval[i].length<=1){
          objval[i]=objval[i][0]||""
        }
      }
    })
  }
  return objval
}


// 格式化日期并进行时区转换
export function formatTimeAndZone(timeString){
  if(timeString.match(/^\d{8}\d{6}Z$|^\d{8}\d{6}.\d+Z$/g)===null){
    return timeString
  }else{
    const timezone=moment().utcOffset()
    return moment(timeString
      .replace(/^(\d{8})(\d{6})Z$/g,"$1T$2")
      .replace(/^(\d{8})(\d{6})\.\d+Z$/g,"$1T$2")
    ).add(timezone,"minutes").format("YYYY/MM/DD HH:mm:ss")
  }
}

// 判断是否是登陆状态
export function isLoginStatus(data){
  if(!data || !(data.hasOwnProperty('token') && data.token!=="")){
    return false
  }else{
    return true
  }
}
// 判断是否是登陆页面
export function isLoginPageAction(location){
  return location.pathname.match('^/login')
}
// 判断是否是用户自己直接修改初始密码
export function isNotAuthChangerPassword(location){
  if(location.hasOwnProperty('pathname') && location.pathname.match('^/user/changepassword') && 
  location.search!=="" ){
    let query=location.query
      if(query.sign &&
        query.token &&
        query.tokenPrefix &&
        query.username && 
        query.username !=="" &&
        query.token !== "" 
      ){
        let url=Object.keys(query).filter(s=>!(s==='sign'||s==='from')).sort().map(i=> `${i}=${query[i]}`).join('&')
        if(md5(url+"&")===query.sign){
          return true
        }else{
          if(errTitle===''){
            errTitle=setTimeout(()=>{message.error(formatMessage({ id:'user.changepassword.signerror'}))},100)
          }
          return false
        }
      }else{
        return false
      }
  }
}