<template>
  <div>
    <nav-bar>
      <template #default>分类</template>
    </nav-bar>

    <div class="mainBox">
<!--      顶部菜单栏-->
      <div class="orderTab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评价排序"></van-tab>
        </van-tabs>
      </div>
<!--      左侧菜单栏-->
      <van-sidebar v-model="activeKey" class="leftMenu">
        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item v-for="item in categories"
                             :title="item.name"
                             :name="item.name">
            <van-sidebar-item v-for="sub in item.children"
                              :title="sub.name"
                              :key="sub.id" @click="getGoods(sub.id)"/>
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>
<!--      商品列表-->
      <div class="goodsList">
        <div>
          <van-card
            v-for="item in showGoods" :key="item.id"
            :num="item.comments_count"
            :tag="item.comments_count >= 0 ? '流行' : '标签'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            @click="itemClick(item.id)"
          />
        </div>
      </div>

    </div>
    <back-top v-show="isBackTop" @bTop="bTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {getCategoryAllData, getCategoryGoods} from "network/category";
  import {ref, reactive, onMounted, computed, watchEffect, nextTick} from 'vue';
  import BackTop from "components/common/backTop/BackTop";
  import BScroll from '@better-scroll/core';
  import PullUp from '@better-scroll/pull-up';
  import {useRouter} from 'vue-router'

  BScroll.use(PullUp);

  export default {
    name: "Category",
    components: {
      NavBar,BackTop
    },
    setup() {
      const router = useRouter();

      let activeKey = ref(0);
      let categories = ref([]);
      let activeNames = ref(1);
      let active = ref(2);
      let bScroll = reactive({}); //BScroll实例
      let isBackTop = ref(false);

      //当前排序条件
      let currentOrder = ref('sales');
      //当前分类ID
      let currentCid = ref(0);
      //数据模型
      const goods = reactive({
        sales: {page: 1, list: []},
        price: {page: 1, list: []},
        comments_count: {page: 1, list: []}
      })
      const showGoods = computed(() => {
        return goods[currentOrder.value].list
      })

      const init = () => {
        getCategoryGoods('sales',currentCid.value).then(res => {
          goods.sales.list = res.goods.data;
        }).then(res => {
          bScroll.refresh();
        });

        getCategoryGoods('price',currentCid.value).then(res => {
          goods.price.list = res.goods.data;
        }).then(res => {
          bScroll.refresh();
        });

        getCategoryGoods('comments_count',currentCid.value).then(res => {
          goods.comments_count.list = res.goods.data;
        }).then(res => {
          bScroll.refresh();
        });
      }

      onMounted(() => {
        getCategoryAllData().then(res => {
          categories.value = res.categories;
        }).then(res => {
          bScroll.refresh();
        });

        init();

        //创建BScroll实例
        bScroll = new BScroll(document.querySelector('.goodsList'),{
          probeType: 3,  // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
          click: true, // 是否允许点击
          pullUpLoad: true //上拉加载更多， 默认是false
        });

        //滚动事件
        bScroll.on('scroll', (position) => {
          isBackTop.value = (-position.y) > 300;
        })

        //上拉事件
        bScroll.on('pullingUp',() => {
          //获取页数
          const page = goods[currentOrder.value].page + 1;
          //获取数据
          getCategoryGoods(currentOrder.value,currentCid.value).then(res => {
            goods[currentOrder.value].list.push(...res.goods.data);
            goods[currentOrder.value].page += 1;
          }).then(res => {
            bScroll.refresh();
          });


          bScroll.finishPullUp()
        });

      })


      //页面有变化时计算高度
      watchEffect(() => {  //数据发生变化后执行该函数
        nextTick(() => {      //当DOM也更新完后，再执行
          bScroll && bScroll.refresh();
        })
      });

      //排序选项点击事件
      const tabClick = function (index) {
        let orders = ['sales','price','comments_count'];
        currentOrder.value = orders[index];
        getCategoryGoods(currentOrder.value,currentCid.value).then(res => {
          goods[currentOrder.value].list = res.goods.data;
        }).then(res => {
          bScroll.refresh();
        });
        console.log(orders[index]);
      }

      //通过分类得到商品
      const getGoods = function (cid) {
        currentCid.value = cid;
        init();
        console.log('排序方式：'+currentOrder.value);
        console.log('分类ID：'+currentCid.value);
      }

      //返回顶部
      const bTop = function () {
        bScroll.scrollTo(0,0,500);
      }

      //点击跳转
      const itemClick = (id) => {
        router.push({path: '/detail', query: {
          id
          }})
      }

      return {
        activeKey,
        categories,
        activeNames,
        active,
        currentOrder,
        currentCid,
        goods,
        showGoods,
        isBackTop,
        tabClick,
        getGoods,
        bTop,
        itemClick
      }
    }
  }
</script>

<style scoped lang="scss">
  .mainBox {
    margin-top: 45px;
    display: flex;
    position: relative;

    .orderTab {
      height: 50px;
      position: fixed;
      left: 135px;
      right: 0;
      z-index: 10;
    }

    .leftMenu {
      width: 130px;
      position: fixed;
      left: 0;
      top: 95px;
    }

    .goodsList {
      flex: 1;
      position: absolute;
      top: 50px;
      left: 130px;
      right: 0;
      height: 100vh;
      padding: 5px;
      text-align: left;
      background-color: #fff;

      .content {
        background-color: red;
        padding: 95px;
      }
    }
  }

</style>
