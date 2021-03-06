import request from 'requestapi'
import {singleListToString,GenerateSignature} from 'utils'
// 修改用户密码API
export function UserChangePassword (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/changepassword/',
        ...data
    })
}
// 管理员重置用户密码接口
export function UserResetPassword(data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/resetpassword/',
        data: GenerateSignature(data)
    })
}
// 管理员发送修改密码连接邮件接口
export function ReSendChangePassword(data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/resendchangepass/',
        data: GenerateSignature(data)
    })
}
// 更新LDAP DN 接口
export function PostLDAPUpdateDN (data) {
    return request({
        method: "post",
        url: '/v1/ldap/dn/update/',
        data: singleListToString(data),
    })
}
// 创建LDAP DN 接口
export function PostLDAPCreateDN (data) {
    return request({
        method: "post",
        url: '/v1/ldap/dn/create/',
        data: singleListToString(data),
    })
}
// 删除LDAP DN 接口
export function PostLDAPDeleteDN (data) {
    return request({
        method: "post",
        url: '/v1/ldap/dn/delete/',
        data: GenerateSignature(data),
    })
}
// 添加用户接口
export function PostLDAPCreateUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/createuser/',
        data: GenerateSignature(data),
    })
}
// 删除用户接口
export function PostLDAPDeleteUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/deleteuser/',
        data: GenerateSignature(data),
    })
}
// 删除用户接口
export function PostLDAPLockUnLockUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/lockunlock/',
        data: GenerateSignature(data),
    })
}
// 更新用户接口
export function PostLDAPUpdateUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/updateuser/',
        data: GenerateSignature(data),
    })
} 
// 获取用户列表API
export function getLDAPUserList () {
    return request({
        method: "get",
        url: '/v1/ldap/user/list/'
    })
}
// 获取用户列表API
export function getLDAPUserAttribute (user) {
    return request({
        method: "get",
        url: `/v1/ldap/user/attr/${user}/`
    })
}
// 获取LDAPClass API
export function getLDAPObjectClassList () {
    return request({
        method: "get",
        url: '/v1/ldap/classes/'
    })
}
// 获取组列表API
export function getGroupList (baseou) {
    return request({
        method: "get",
        url: `/v1/ldap/ous/${baseou||''}`
    })
}
// 获取用户分配的权限列表API
export function getUserPermissionList (userdn) {
    return request({
        method: "get",
        url: `/v1/ldap/permission/${userdn||''}/`
    })
}
// 获取权限组列表
export function getPermissionGroupsListApi () {
    return request({
        method: "get",
        url: `/v1/ldap/allgroups/`
    })
}
// 获取权限组列表
export function PostLDAPGroupPermissions (data) {
    return request({
        method: "post",
        url: '/v1/ldap/save/permissions/',
        data: GenerateSignature(data),
    })
}
// 提交ldif脚本文件
export function PostLDAPLdifScripts (data) {
    return request({
        method: "post",
        url: '/v1/ldap/ldif/',
        data: GenerateSignature(data),
    })
}
// 获取权限组列表
export function GetSystemCrontabLogsApi(data) {

    return request({
        method: "get",
        url: '/v1/system/cronlogs/',
        params:GenerateSignature(data)
    })
}
// 获取aliclound Ecs 列表
export function GetAliCloundEcsListApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/ecs/list/',
        params:GenerateSignature(data)
    })
}
// 获取aliclound Ecs 监控数据列表
export function GetAliCloundEcsMonitorDataListApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/ecs/monitordata/',
        params: GenerateSignature(data)
    })
}
// 获取aliclound Regions 列表
export function GetAliCloundRegionsListApi() {
    return request({
        method: "get",
        url: '/v1/aliclound/regions/list/',
    })
}
// 获取aliclound Tags 列表
export function GetAliCloundTagsListApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/tags/list/',
        params: GenerateSignature(data)
    })
}
// 获取aliclound 证书状态统计
export function GetAliCloundCerificateCountApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/cerificate/count/',
        params:data
    })
}
// 获取aliclound 证书状态统计
export function GetAliCloundCerificateListApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/cerificate/list/',
        params: data
    })
}
// 检查aliclound 证书与部署主机上的证书失效时间是否一至
export function GetAliCloundCerificateInvalidApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/cerificate/invalid/',
        params: data
    })
}
// 检查aliclound 证书与部署主机上的证书失效时间是否一至
export function GetAliCloundDomainListApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/domain/list/',
        params: data
    })
}

// 检查aliclound 证书与部署主机上的证书失效时间是否一至
export function GetAliCloundEcsStatusCountApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/ecs/allstatus/',
        params: data
    })
}
// 检查aliclound 证书与部署主机上的证书失效时间是否一至
export function GetAliCloundRdsStatusCountApi(data) {
    return request({
        method: "get",
        url: '/v1/aliclound/rds/allstatus/',
        params:data
    })
}
// 获取组列表API
export function GetAliCloundAccountNameListApi () {
    return request({
        method: "get",
        url: "/v1/aliclound/account/namelist/"
    })
}
// 获取生成的sshkey 公钥 私钥
export function GetSSHKeyPrivateAndPublicKeyApi(data) {
    return request({
        method: "post",
        url: "/v1/system/generate/sshkey/",
        data: GenerateSignature(data)
    })
}
// 获取阿里去帐户余额
export function GetAliCloundAccountBablanceApi(data) {
    return request({
        method: "get",
        url: "/v1/aliclound/account/bablance/",
        data
    })
}