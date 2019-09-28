import request from 'requestapi'
import {GenerateSignature} from 'utils'

export function userlogin (data) {
    return request({
        method: "post",
        url: '/v1/login/',
        data: GenerateSignature(data),
    })
}
export function userlogout (data) {
    return request({
        method: "post",
        url: '/v1/logout/',
        data: data,
    })
}