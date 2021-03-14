import { createRouter, createWebHistory } from 'vue-router';
import { Notify , Toast} from 'vant';
import store from '../store/index';

const Home = () => import('../views/home/Home');
const Detail = () => import('../views/detail/Detail');
const Category = () => import('../views/category/Category');
const Profile = () => import('../views/profile/Profile');
const ShopCart = () => import('../views/shopCart/ShopCart');
const Register = () => import('../views/register/Register');
const Login = () => import('../views/login/Login');
const CreateOrder = () => import('../views/createOrder/CreateOrder');



const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta: {
      title: '图书兄弟'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '图书兄弟'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: '图书兄弟-分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '图书兄弟-商品详情'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '图书兄弟-个人主页',
      isAuthRequire: true
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: '图书兄弟-购物车',
      isAuthRequire: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '图书兄弟-登录'
    }
  },
  {
    path: '/createOrder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title: '图书兄弟-创建订单'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) =>{
  //如果没有登录，这里跳转
  if(to.meta.isAuthRequire && store.state.user.isLogin === false) {
    Toast.fail('请先登录')
    setTimeout(() => {
      next('/login');
    },1000)
  }
  else{
    next();
  }
  document.title = to.meta.title;
})
export default router
