<template>
  <div>
    <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in banners" :key="index">
        <img v-lazy="item.img_url" alt="">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>
  img {
    width: 100vw;
    height: auto;
  }
</style>
