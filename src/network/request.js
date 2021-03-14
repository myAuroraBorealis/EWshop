import axios from "axios";
import { Notify ,Toast} from 'vant';
import router from '@/router'


//封装请求
export function request(config) {
  //创建实例
  const instance =axios.create({
    baseURL : 'https://api.shop.eduwork.cn',
    timeout : 5000
  })

  //请求拦截
  instance.interceptors.request.use(config => {
    //如果有个接口需要认证才可以访问，在这里统一设置
      const token = window.localStorage.getItem('token');

      if(token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
    //直接放行
    return config
  },err => {
    //一般情况下请求是不会出错的，一般不用写
    console.log(err.status);
  })

  //响应拦截
  instance.interceptors.response.use(res => {
    return res.data ? res.data : res;
  },err => {
    //如果有需要授权才可以登录的接口，统一去login授权
    if(err.response.status === 401) {
      Toast.fail('请先登录');
      setTimeout(() => {
        router.push({path: '/login'});
      },1000)
    }
    //如果有错误，这里会处理，显示错误信息
    Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
  })

  //返回实例
  return instance(config);
}
