import axios from 'axios';

const timeout = 10000;
const Axios = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: timeout,
});

// Add a request interceptor
Axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  err => {
    // Do something with request error
    return Promise.reject(err.data.error.message);
  }
);

Axios.interceptors.response.use(
  res => {
    // Do something with response data
    let { status, data } = res;
    if (status && status === 200) {
      return data
    } else {
      return Promise.reject(res);
    }
  },
  err => {
    // Do something with response error
    let timeoutStr = `timeout of ${timeout}ms exceeded`;
    if(err.message == timeoutStr) {
      return Promise.reject({
        message: "获取数据失败",
        desc: "连接超时",
        msg: timeoutStr,
        errType: 9999,
        api: err.config.url
      });
    }
    // console.log('axios response err: ', err);
    return Promise.reject(err);
  }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function requestGet(url, params, baseUrl) {
  if(baseUrl) {
    Axios.defaults.baseURL = baseUrl;
  }
  return new Promise((resolve, reject) => {
    Axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function requestPost(url, params) {
  return new Promise((resolve, reject) => {
    Axios.post(url, JSON.stringify(params))
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err)
      })
  })
}