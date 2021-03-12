const axios = require('axios')
const service = axios.create({
  timeout: 8000 // request timeout
})
// 请求前
service.interceptors.request.use(config => {
  return config
},
error => {
  return Promise.reject(error)
}
)
// 接收响应
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res) {
      return Promise.resolve(res)
    } else {
      return Promise.resolve({})
    }
  },
  error => {
    if(error.response.status === 302){
      // console.log(error.response.headers);
      return Promise.resolve(error.response.headers.location)
    }
  }
)
module.exports = service
