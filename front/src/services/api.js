import request from '../utils/request'
// 修改用户密码API
export function UserChangePassword (data) {
    return request({
        method: "post",
        url: '/v1/ldap/user/changepassword/',
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
// 获取LDAPClass API
export function getLDAPObjectClassList () {
    return request({
        method: "get",
        url: '/v1/ldap/classes/'
    })
}
// 获取组列表API
export function getGroupList (data) {
    return request({
        method: "get",
        url: '/v1/ldap/ous/',
        data: data,
    })
}