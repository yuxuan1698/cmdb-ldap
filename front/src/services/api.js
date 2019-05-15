import request from '../utils/request'
import {singleListToString} from '../utils/utils'
// 修改用户密码API
export function UserChangePassword (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/changepassword/',
        data: data,
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
// 更新LDAP DN 接口
export function PostLDAPCreateDN (data) {
    return request({
        method: "post",
        url: '/v1/ldap/dn/create/',
        data: singleListToString(data),
    })
}
// 添加用户接口
export function PostLDAPCreateUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/createuser/',
        data: data,
    })
}
// 删除用户接口
export function PostLDAPDeleteUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/deleteuser/',
        data: data,
    })
}
// 更新用户接口
export function PostLDAPUpdateUser (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/updateuser/',
        data: data,
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
