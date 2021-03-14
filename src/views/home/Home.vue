<template>
  <div id="home">
    <nav-bar>
      <template #default>图书兄弟</template>
    </nav-bar>

    <tab-control v-show="isTabFixed" :titles="['畅销','新书','精选']" @tabClick="tabClick"></tab-control>

    <div class="wrapper">
      <div class="content">
        <div ref="banRef">
          <!--    轮播图-->
          <div class="banners">
            <home-swiper :banners="banners"></home-swiper>
          </div>
          <!--    轮播图下的推荐-->
          <recommend-view :recommend="recommend"></recommend-view>
        </div>

        <tab-control :titles="['畅销','新书','精选']" @tabClick="tabClick"></tab-control>
<!--        商品列表-->
        <goods-list :goods="showGoods" @imageLoad="imageLoad"></goods-list>
      </div>
    </div>
<!--    回到顶部-->
    <back-top v-show="isBackTop" @bTop="bTop"></back-top>
  </div>
</template>


<script>
  import NavBar from "components/common/navbar/NavBar";
  import RecommendView from "components/content/homeComps/recommendView/RecommendView";
  import {getHomeAllData,getHomeGoods} from "network/home";
  import TabControl from "components/content/homeComps/TabControl/TabControl";
  import GoodsList from "components/content/homeComps/goodList/GoodsList";
  import BackTop from "components/common/backTop/BackTop";
  import HomeSwiper from "components/content/homeComps/HomeSwiper/HomeSwiper";
  import BScroll from '@better-scroll/core';
  import PullUp from '@better-scroll/pull-up'
  import {onMounted,watchEffect,nextTick,ref,reactive ,} from 'vue'

  BScroll.use(PullUp);

  export default {
    name: "Home",
    data() {
      return {
        recommend: [],
        types: ['sales','new','recommend']
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    methods: {
      tabClick(index) {
        this.currentType = this.types[index];
      }
    },
    components: {
      NavBar,
      RecommendView,
      TabControl,
      GoodsList,
      BackTop,
      HomeSwiper
    },
    mounted() {
      //获取主页数据
      getHomeAllData().then(res => {
        this.recommend = res.goods.data;
        this.banners = res.slides;
        // console.log(this.banners);
      });
      //获取热销数据
      getHomeGoods('sales').then(res => {
       this.goods.sales.list = res.goods.data;
      });
      //获取推荐数据
      getHomeGoods('recommend').then(res => {
        this.goods.recommend.list = res.goods.data;
      });
      //获取新品数据
      getHomeGoods('new').then(res => {
       this.goods.new.list = res.goods.data;
      });

    },
    setup() {
      let isTabFixed = ref(false);           //隐藏导航栏是否显示
      let isBackTop = ref(false);            //是否显示返回顶部按钮
      let banners = reactive([]);           //首页轮播图数据
      let banRef = ref(null);                //获取包含轮播图和推荐的DOM元素
      let bScroll = reactive({});           //better-scroll的实例
      const goods = reactive({              //商品信息模型
        sales: {page:1, list:[]},
        new: {page:1, list:[]},
        recommend: {page:1, list:[]}
      });
      let currentType = ref('sales')        //当前处于的类型

      onMounted(() => {
        // 创建BetterScroll对象
        bScroll = new BScroll(document.querySelector('.wrapper'), {
          probeType: 3,  // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
          click: true, // 是否允许点击
          pullUpLoad: true //上拉加载更多， 默认是false
        });

        //触发滚动事件
        bScroll.on('scroll', (position) =>{
          // console.log(banRef.value.offsetHeight);
          //当滚动距离大于banRef的高度时，Tab栏显示
          isBackTop.value = isTabFixed.value = (-position.y) > banRef.value.offsetHeight
        });

        //上拉加载更多,即触发pullingUp
        bScroll.on('pullingUp', () => {
          // console.log('加载更多');

          const page = goods[currentType.value].page + 1;

          // console.log('当前类型: ' + currentType.value + '，当前页: ' + page);

          getHomeGoods(currentType.value, page).then(res => {
            //更新list列表里面的数据
            goods[currentType.value].list.push(...res.goods.data);
            goods[currentType.value].page += 1;
          })

          bScroll.finishPullUp();
        })
      });

      //有变化时计算高度
      watchEffect(() => {  //数据发生变化后执行该函数
        nextTick(() => {      //当DOM也更新完后，再执行
          bScroll && bScroll.refresh();
        })
      })
      //当获取到图片时更新一次bScroll
      const imageLoad = function() {
        bScroll.refresh();
      }

      //回到顶部
      const bTop = function () {
        bScroll.scrollTo(0,0,500);
      }

      return {
        banners,
        isTabFixed,
        bScroll,
        goods,
        currentType,
        banRef,
        isBackTop,
        imageLoad,
        bTop
      }
    }
  }
</script>

<style scoped>
  .banners img {
    width: 100vw;
    height: auto;
  }

  #home {
    height: 100vh;
    position: relative;
  }

  .wrapper {
    position: absolute;
    top: 45px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .content {

  }
</style>
