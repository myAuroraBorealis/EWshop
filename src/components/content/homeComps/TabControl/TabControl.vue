<template>
  <div class="tab-control">
    <div  v-for="(item, index) in titles" :key="index"
          @click="itemClick(index)" class="tab-control-item" :class="{active: currentIndex == index}">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index;
        this.$emit('tabClick',index);
      }
    }
  }
</script>

<style scoped lang="scss">
  .tab-control {
    display: flex;
    width: 100vw;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    position: sticky;
    background-color: #fff;
    top: 44px;
    z-index: 2;
    .tab-control-item {
      flex: 1;
      span {
        padding: 5px;
      }
    }
    .active {
      color: var(--color-tint);
      span {
        border-bottom: 3px solid var(--color-tint);
      }
    }
  }
</style>