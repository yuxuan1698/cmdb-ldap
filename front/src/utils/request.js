import axios from 'axios';
import NProgress from 'nprogress';
import { message } from 'antd';
// 国际化
import {formatMessage} from 'umi/locale';
import { GenerateRequestAuthParams,formatReturnMsg } from "utils";

/**
 * 一、功能：
 * 1. 统一拦截http错误请求码；
 * 2. 统一拦截业务错误代码；
 * 3. 统一设置请求前缀
 * |-- 每个 http 加前缀 baseURL = /api/v1，从配置文件中获取 apiPrefix
 * 4. 配置异步请求过渡状态：显示蓝色加载条表示正在请求中，避免给用户页面假死的不好体验。
 * |-- 使用 NProgress 工具库。
 * 
 * 二、引包：
 * |-- axios：http 请求工具库
 * |-- NProgress：异步请求过度条，在浏览器主体部分顶部显示蓝色小条
 * |-- notification：Antd组件 > 处理错误响应码提示信息
 * |-- routerRedux：dva/router对象，用于路由跳转，错误响应码跳转相应页面
 * |-- store：dva中对象，使用里面的 dispatch 对象，用于触发路由跳转
 */

// 设置全局参数，如响应超市时间，请求前缀等。
axios.defaults.timeout = 20000
axios.defaults.baseURL = '/api/';
axios.defaults.withCredentials = true;

// 添加一个请求拦截器，用于设请求HEADER及请求过渡状态
axios.interceptors.request.use((config) => {
  // 请求开始，蓝色过渡滚动条开始出现
  const auth = GenerateRequestAuthParams()
  if(auth){
    config=Object.assign(config,auth)
  }
  NProgress.start();
  NProgress.set(.3)
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加一个返回拦截器
axios.interceptors.response.use((response) => {
  // 请求结束，蓝色过渡滚动条消失
  NProgress.done();
  return response;
}, async (error) => {
  // 请求结束，蓝色过渡滚动条消失
  NProgress.done();
  if(error.response){
    const {status,data}=error.response
    if(data){
      if(status===401){
        window.g_app._store.dispatch({
          type: 'login/logoutAction',
        });
        formatReturnMsg(data,status)
      }else{
        formatReturnMsg(data,status)
      }
    }
  }
  return Promise.reject(error);
});


export default function request (opt) {
  let timer= setInterval(()=>{
      NProgress.inc(0.005)
    }, 150);
  // 调用 axios api，统一拦截
  return axios(opt)
    .then((response) => {
      console.log(`【${opt.method} ${opt.url}】请求成功，响应数据：${response}`)
      clearInterval(timer)
      return { ...response.data }
    })
    .catch((error) => {
      clearInterval(timer)
      // 请求配置发生的错误
      if (!error.response) {
        message.error(`${formatMessage({id:'request.status.timeout'})} ${error.message}`);
        console.log(`Error ${error.message}`);
        return false
      }
      return false;
    })
}