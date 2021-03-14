<template>
  <div>
    <nav-bar>
      <template #default>购物车</template>
    </nav-bar>

    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group v-model="result" @change="groupChange">
          <van-swipe-cell
            v-for="(item,index) in list"
            key="item.goods.id"
            :right-width="50">
            <div class="good-item">
              <van-checkbox :name="item.id"/>
              <div class="good-image">
                <img :src="item.goods.cover_url" alt="图片">
              </div>
              <div class="good-desc">
                <div class="good-title">
                  <span>{{item.goods.title}}</span>
                  <span>{{'库存:'+item.goods.stock}}</span>
                </div>
                <div class="good-btn">
                  <div class="price"><small>￥</small>{{item.goods.price + '.00'}}</div>
                  <van-stepper min="1"
                               :max="item.goods.stock"
                               :name="item.id"
                               :model-value="item.num"
                               @change="onChange"
                               integer
                               async-change/>
                </div>
              </div>
            </div>
            <template #right>
              <van-button square
                          @click="deleteGood(item.id)"
                          type="danger"
                          icon="delete"
                          class="delete-button"/>
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
<!--      结算组件-->
      <van-submit-bar
        class="submit-btn"
        :price="total*100"
        button-text="结算"
        @submit="onSubmit" >
        <van-checkbox v-model="checkedAll" @click="allChecked">全选</van-checkbox>
      </van-submit-bar>

<!--      当购车车为空时-->
      <div class="empty" v-if="!$store.state.cartCount">
        <img src="~assets/images/empty-car.png" alt="空购物车">
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {ref,reactive,toRefs,onMounted,computed} from 'vue';
  import {useRouter} from 'vue-router';
  import {useStore} from 'vuex';
  import {Toast} from 'vant';
  import {getCartAllItem, deleteCartItem, checkCartItem, modifyCartItem} from "network/shopCart";

  export default {
    name: "ShopCart",
    components: {
      NavBar
    },
    setup() {

      const router = useRouter();
      const store = useStore();

      const state = reactive({
        list: [],
        result: [],    //选中的数组
        checkedAll: true  //是否全选
      })
      //计算总价格
      const total = computed(() => {
        let sum = 0;

        state.list.filter(item => state.result.includes(item.id)).forEach(item => {
          sum += parseInt(item.num) * parseFloat(item.goods.price);
        })

        return sum;
      })

      //初始化购物车数据
      const init = () => {
        Toast.loading({message: '加载中...',forbidClick: true})

        getCartAllItem('goods').then(res => {
          state.list = res.data;
          state.result = res.data.filter(n => n.is_checked == 1).map(item => item.id);
          Toast.clear();
        })
      }

      onMounted(() => {
        init();
      })

      //异步改变商品数量
      const onChange = (value,detail) => {
        Toast.loading({message: '加载中', forbidClick: true});
        modifyCartItem(detail.name,{num: value}).then(res => {
          //修改list中的属性，否则会导致结算的值计算错误
          state.list.forEach(item => {
            if(item.id === detail.name){
              item.num = value;
            }
          })
          Toast.clear();
        })
      }

      //删除商品
      const deleteGood = (id) => {
        deleteCartItem(id).then(res => {
          init();  //刷新数据，重新初始化
          store.dispatch('updateCart');
        })
      }

      //复选框改变选中状态函数
      const groupChange = (result) => {
        //如果选中列表长度和购物车列表长度一样，全选按钮选中,否则不选择
        if(result.length == state.list.length) {
          state.checkedAll = true;
        }else {
          state.checkedAll = false;
        }
        // console.log(result);
        // console.log('此时是'+state.checkedAll);
        //同步本地中的数据
        state.result = result;
        //改变数据库中的数据
        checkCartItem({cart_ids: result});
      }

      //全选事件
      const allChecked = () => {
        //由于我们使用双向数据绑定，执行点击事件前,state.checked已经改变了
        if(state.checkedAll){
          //全选操作
          state.result = state.list.map(item => item.id);
        } else{
          //取消全选操作
          state.result = [];
        }
      }

      //结算函数
      const onSubmit = () => {
        if(state.result.length == 0){
          Toast.fail('请选择商品');
        }else {
          router.push({path:'/createOrder'});
        }
      }



      //当购物车为空时，前往购物
      const goTo = () => {
        router.push({path: '/home'})
      }

      return {
        total,
        ...toRefs(state),
        onSubmit,
        allChecked,
        goTo,
        onChange,
        groupChange,
        deleteGood
      }

    }
  }
</script>

<style scoped lang="scss">
  .cart-body {
    margin: 45px 0 105px 0;

    .good-item {
      display: flex;
      margin-top: 5px;
      padding-left: 10px;
      background-color: rgba(192,192,192,0.1);

      img {
        width: 99px;
        margin-left: 5px;
        border: 1px solid rgba(192,192,192,0.1);
      }

      .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 10px;

        .good-title {
          display: flex;
          justify-content: space-between;
        }

        .good-btn {
          display: flex;
          justify-content: space-between;

          .price{
            color: orangered;
            font-size: 16px;
            line-height: 28px;
          }
        }
      }
    }
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }

  .submit-btn {
    margin-bottom: 55px;
  }

  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    img {
      margin-top: 20vw;
      width: 50vw;
      height: auto;
    }

    .title {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
  }
</style>
