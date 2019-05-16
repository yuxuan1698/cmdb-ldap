import { Store } from "./store";
import { notification,message,Alert,Icon } from 'antd';
import {formatMessage} from 'umi/locale';
// import { object, instanceOf } from "prop-types";
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
                    return <div key={v}><Icon type="exclamation-circle" theme="twoTone" />{msgObj[i][v]} </div>
                  })
        }
        return <Alert key={i} message={msgObj[i]} type="error" />
      })
      notification.error({
        message:"错误的请求,或服务器返回错误",
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