<template>
  <div>
    <nav-bar>
      <template #default>商品详情</template>
    </nav-bar>

    <van-image style="margin-top: 50px"
      width="100%"
      lazy-load
      :src="detail.cover_url"
    />

    <van-card style="text-align: left"
      :price="detail.price + '.00'"
      :desc="detail.description"
      :title="detail.title"
    >
      <template #tags>
        <van-tag plain type="danger">热销</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button size="normal" type="warning" @click="handleAddCart">加入购物车</van-button>
        <van-button size="normal" type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>

    <van-tabs v-model="active">
      <van-tab title="概述">
        <div class="content" v-html="detail.details">

        </div>
      </van-tab>
      <van-tab title="热评">内容 2</van-tab>
      <van-tab title="相关图书">
        <goods-list :goods="like_goods" ></goods-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {useRoute,useRouter} from 'vue-router'
  import {ref,reactive,onMounted,toRefs} from 'vue';
  import {useStore} from 'vuex';
  import {getDetail} from "network/detail";
  import GoodsList from "components/content/homeComps/goodList/GoodsList";
  import {addCartItem} from "network/shopCart";
  import {Toast} from 'vant'

  export default {
    name: "Detail",
    components: {
      NavBar,
      GoodsList
    },
    setup(props,context) {
      const route = useRoute();
      const router = useRouter();
      const store = useStore();

      let active = ref(2);

      let id = ref(0);  //商品ID
      let book = reactive({
        detail: {},
        like_goods: []
      })

      onMounted(() => {
        id.value = route.query.id;

        getDetail(id.value).then(res => {
          book.detail = res.goods;
          book.like_goods = res.like_goods;
        })
      })


      //添加购物车
      const handleAddCart = () => {
        addCartItem({
          goods_id: book.detail.id,
          num: 1
        }).then(res => {
          if( res.status === 201 || res.status ===204 ) {
            Toast.success('添加成功');
            store.dispatch('updateCart');
          }
        })
      }
      //立即购买
      const goToCart = () => {
        addCartItem({
          goods_id: book.detail.id,
          num: 1
        }).then(res => {
          if( res.status === 201 || res.status ===204 ) {
            Toast.success('添加成功');
            //变更购车车图标上的状态cartCount
            store.dispatch('updateCart');
            router.push({path: '/shopCart'});
          }
        })
      }

      return {
        id,
        ...toRefs(book),
        active,
        handleAddCart,
        goToCart
      }

    }
  }
</script>

<style scoped lang="scss">
  .content {
    padding: 10px;


  }
</style>
