const mutations = {
  //修改登录的状态
  setIsLogin(state,payload) {
    state.user.isLogin = payload;
  },
  //修改购物车的商品数量
  addCart(state,payload) {
    state.cartCount = payload.count;
  }
}

export default mutations
