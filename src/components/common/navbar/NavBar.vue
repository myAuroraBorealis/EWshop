<template>
  <div class="nav-bar" @click="goBack">
    <div class="left">
      <slot name="left">
        <img src="~assets/images/left.png" alt="">
      </slot>
    </div>
    <div class="center">
      <slot>图书商城</slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar",
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 10;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: 0 2px 1px rgba(100,100,100,0.1);
    display: flex;
  }

  .left, .right {
    width: 60px;
  }

  .left img {
    width: 45px;
    padding: 12px;
  }
  .center {
    flex: 1;
  }
</style>