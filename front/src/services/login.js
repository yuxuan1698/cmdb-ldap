import request from 'requestapi'
export function userlogin (data) {
    return request({
        method: "post",
        url: '/v1/login/',
        data: data,
    })
}
export function userlogout (data) {
    return request({
        method: "post",
        url: '/v1/logout/',
        data: data,
    })
}