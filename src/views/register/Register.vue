<template>
  <div>
    <nav-bar>
      <template #default>新用户注册</template>
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
          placeholder="请输入正确的邮箱格式"
          :rules="[{ required: true, message: '请输入邮箱' }]"
        />
        <van-field
          v-model="name"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password_confirmation"
          type="password"
          name="密码"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[{ required: true, message: '请填写一致密码' }]"
        />

        <div class="toggle" @click="toggleToLogin">
          <div class="link-login">已有账号，立即登录</div>
        </div>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" color="#44b883">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {ref,reactive,toRefs} from 'vue'
  import {register} from "network/register";
  import { Notify , Toast} from 'vant';
  import {useRouter} from 'vue-router'


  export default {
    name: "Register",
    components: {
      NavBar
    },
    setup() {
      const userInfo = reactive({
        email: '',
        name: '',
        password: '',
        password_confirmation: ''
      })

      const router = useRouter();

      const onSubmit = (values) => {
        //先验证
        if(userInfo.password !== userInfo.password_confirmation) {
          Notify({type: 'danger', message: '两次密码不一致'});

        }else {
         //提交给服务器
          register(userInfo).then(res => {
            console.log(res);

            if(res.status === 201) {
              //提示注册成功
              Toast.success('注册成功');
              //跳转回登录界面
              setTimeout(() => {
                router.push({path:'/login'});
              },1000);

              userInfo.password = '';
              userInfo.password_confirmation = '';
            }
          })
        }
      }

      //点击跳转到登录界面
      const toggleToLogin = () => {
        router.push({path:'/login'});
      }

      return {
        ...toRefs(userInfo),
        onSubmit,
        toggleToLogin
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
