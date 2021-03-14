<template>
  <div>
    <nav-bar>
      <template #default>登录</template>
    </nav-bar>

    <div>
      <div class="register-img">
        <van-image
          width="10rem"
          height="8rem"
          fit="contain"
          src="https://www.lmonkey.com/_nuxt/img/logo.ca1ae0c.png"
        />
      </div>

      <van-form @submit="onSubmit">
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请输入正确的邮箱' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入登录密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />

        <div class="toggle" @click="toggleToRegister">
          <div class="link-login">没有账号，立即注册</div>
        </div>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" color="#44b883">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {ref,reactive,toRefs} from 'vue'
  import {login} from "network/login";
  import { Notify , Toast} from 'vant';
  import {useRouter} from 'vue-router'
  import {useStore} from 'vuex';


  export default {
    name: "Login",
    components: {
      NavBar
    },
    setup() {
      const userInfo = reactive({
        email: '',
        password: ''
      })

      const router = useRouter();
      const store = useStore();

      const onSubmit = (values) => {
        login(userInfo).then(res => {
          /*将token保存在本地window.localStorage  存:setItem(key,value) 取:get(key)
           *(如果保存在Vuex中，一刷新就要重新登录)
           */
          window.localStorage.setItem('token',res.access_token);
          Toast.success('登录成功');

          //在Vuex中判断是否处于登录状态
          store.commit('setIsLogin', true);

          //清除掉userInfo里面的信息
          userInfo.email = '';
          userInfo.password = '';

          //跳转回原来的跳转页面
          setTimeout(() => {
            router.go(-1);
          },500)
        })
      }

      //点击跳转到注册界面
      const toggleToRegister = () => {
        router.push({path:'/register'});
      }

      return {
        ...toRefs(userInfo),
        onSubmit,
        toggleToRegister
      }
    }
  }
</script>

<style scoped>
  .register-img {
    margin-top: 50px;
    text-align: center;
  }

  .link-login {
    margin-bottom: 20px;
    margin-right: 10px;
    float: right;
    font-size: 14px;
    color: #44b883;
  }
</style>
