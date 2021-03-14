<template>
  <div>
    <nav-bar>
      <template #default>个人主页</template>
    </nav-bar>

    <div style="margin: 15px;margin-top:100px;">
      <van-button round block @click="toLogout" color="#44b883">退出</van-button>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {logout} from "network/login";
  import {Toast} from 'vant';
  import {useRouter} from 'vue-router';
  import {useStore} from 'vuex';

  export default {
    name: "Pronfile",
    components: {
      NavBar
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      //退出登录
      const toLogout = () => {
        logout().then(res => {
          if(res.status === 204) {
            Toast.success('退出成功');

            //清除token window.localStorage
            window.localStorage.setItem('token','');

            //清楚Vuex中的登录状态
            store.commit('setIsLogin',false);

            //跳转回登录界面
            setTimeout(() => {
              router.push({path: '/login'});
            },500)
          }
        })
      }

      return {
        toLogout
      }
    }
  }
</script>

<style scoped>

</style>
