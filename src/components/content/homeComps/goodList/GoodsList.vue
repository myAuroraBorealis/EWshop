<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" @imageLoad="imageLoad" :product="item" :key="item"></goods-list-item>
  </div>
</template>

<script>
  import GoodsListItem from "./GoodsListItem";
  export default {
    name: "GoodsList",
    props: {
      goods: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      imageLoad() {
        this.$emit('imageLoad');
      }
    },
    components: {
      GoodsListItem
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 5px;
  }
</style>
