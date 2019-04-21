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
export function UserList (data) {
    return request({
        method: "get",
        url: '/v1/ldap/userlist/',
        data: data,
    })
}
// 获取组列表API
export function GroupList (data) {
    return request({
        method: "get",
        url: '/v1/ldap/ous/',
        data: data,
    })
}