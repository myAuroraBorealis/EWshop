<template>
  <div class="recommend">
    <div class="recommend-item" v-for="item in recommend.slice(0,4)" :key="recommend.id">
      <a href="" @click.prevent="goProductDetail(item.id)">
        <img v-lazy="item.cover_url" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecomentView",
    props: {
      recommend: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      goProductDetail(id) {
        this.$router.push({path: '/detail', query: {id}})
      }
    }
  }
</script>

<style scoped lang="scss">
  .recommend {
    display: flex;
    width: 100vw;
    padding: 15px 0 30px;
    border-bottom: 8px solid #eee;
    font-size: 12px;
  }

  .recommend-item {
    flex: 1;
    img {
      width: 25vw;
      margin-bottom: 10px;
    }
  }
</style>
