import { Store } from "cmdbstore";
import { notification,message,Alert,Icon } from 'antd';
import {formatMessage} from 'umi/locale';
import moment from 'moment'
import md5 from 'js-md5'

let errTitle=''
// ldap_字段映射
export function LDAP_MAP_FIELDS_FORMAT(){
  return {
    uid:formatMessage({id:'ldap_uid'}),
    sn:formatMessage({id:'ldap_sn'}),
    givenName:formatMessage({id:'ldap_givenName'}),
    mobile:formatMessage({id:'ldap_mobile'}),
    cn:formatMessage({id:'ldap_cn'}),
    mail:formatMessage({id:'ldap_mail'}),
    uidNumber:formatMessage({id:'ldap_uidNumber'}),
    gidNumber:formatMessage({id:'ldap_gidNumber'}),
    loginShell:formatMessage({id:'ldap_loginShell'}),
    departmentNumber:formatMessage({id:'ldap_departmentNumber'}),
    homeDirectory:formatMessage({id:'ldap_homeDirectory'}),
    userPassword:formatMessage({id:'ldap_userPassword'}),
    sshPublicKey:formatMessage({id:'ldap_sshPublicKey'}),
    manager:formatMessage({id:'ldap_manager'}),
    description:formatMessage({id:'ldap_description'}),
    ou:formatMessage({id:'ldap_ou'}),
    o:formatMessage({id:'ldap_o'}),
    member:formatMessage({id:'ldap_member'}),
    uniqueMember:formatMessage({id:'ldap_uniqueMember'}),
    memberUid:formatMessage({id:'ldap_memberUid'}),
  }
}
// 生成认证请求头
export function GenerateRequestAuthParams() {
  const header_info=Store.getLocal('userinfo');
  const language=Store.getLocal('umi_locale',false) || navigator.language||navigator.userLanguage;
  let header={"CMDB-Language":language}
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
      return i
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
// 格式化日期并进行时区转换
export function formatAliCloundTime(beginTime,EndTime,Format){
  if(Format){
    return moment(EndTime).utc().format(Format)
  }
  if(EndTime){
    return moment(EndTime).diff(moment(beginTime), 'days')
  }else{
      return moment(beginTime).utc().format("YYYY年MM月DD日 HH:mm")
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

// 下载SSH
export function downloadSSHKey(data,username){
  if(!data instanceof Object) return message.error('下载SSHKey参数不合法。');
  let PrivateElement = document.createElement('a')
  Object.keys(data).map(k=>{
    let keyObj = new Blob([data[k]], {
      type: 'application/x-x509-ca-cert'
    })
    //创建下载的对象链接
    let DownloadHref = window.URL.createObjectURL(keyObj);
    // PrivateElement.style.display="none"
    PrivateElement.href = DownloadHref;
    //下载的文件名以用户名命名
    if(k==='privatekey'){
      PrivateElement.download = `${username||'nouser'}-private.pem`;
    }
    if(k==='publickey'){
      PrivateElement.download = `${username||'nouser'}-public.key`;
    }
    document.body.appendChild(PrivateElement);
    //点击下载
    PrivateElement.click();
    window.URL.revokeObjectURL(DownloadHref);
    return  k
  })
  //下载完成移除元素
  document.body.removeChild(PrivateElement);
  message.success("SSHKey下载成功！")
  return true
}
// 导出用户数据
export function exportUserDatas(userlist,fields){
  if(!userlist instanceof Object || !fields instanceof Array) return message.error('下载用户数据不合法。');
  let PrivateElement = document.createElement('a')
  
  let usercsvstr=fields.join(',')+'\n'
  Object.values(userlist).map(k=>{
    let tmpFields=[]
    fields.map(it=>{
      if(it==='dn'){
        tmpFields.push("'"+k[0]+"'")
      }else if(k[1].hasOwnProperty(it)){
        if (k[1][it] instanceof Array){
          tmpFields.push(k[1][it].join('，'))
        }else{
          tmpFields.push(k[1][it])
        }
      }else{
        tmpFields.push("")
      }
    })
    usercsvstr+=tmpFields.join(',')+'\n'
    return true
  })
  let keyObj = new Blob(["\uFEFF"+usercsvstr], {
    type: 'text/csv'
  })
  //创建下载的对象链接
  let DownloadHref = window.URL.createObjectURL(keyObj);
  // PrivateElement.style.display="none"
  PrivateElement.href = DownloadHref;
  //下载的文件名以用户名命名
  PrivateElement.download = `users.csv`;
  document.body.appendChild(PrivateElement);
  //点击下载
  PrivateElement.click();
  window.URL.revokeObjectURL(DownloadHref);
  document.body.removeChild(PrivateElement);
  message.success("用户数据下载成功！")
  return true
}
// 生成请求体的签名
export function GenerateSignature(data){
  if(!data instanceof Object) return message.error('data参数不合法。');
  let SignData={},SignString=""
  Object.keys(data).sort().map(i=>{
    SignData[i]=data[i]
    SignString=`${SignString}+${data[i]}`
    return i
  })
  SignData['sign']=md5(SignString)
  return SignData
}

// 格式化字节单位
export const formatByteUnits=(value)=>{
  if (value <= 0) {
      value = '0B';
  }
  else{
      var k = 1024;
      var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      var c = Math.floor(Math.log(value) / Math.log(k));
      value = (value / Math.pow(k, c)).toFixed(2) + ' ' + sizes[c];
  }
  return value
}
