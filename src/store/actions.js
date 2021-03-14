import {getCartAllItem} from "network/shopCart";

const actions = {
  updateCart({commit}) {
    getCartAllItem().then(res => {
      commit('addCart',{count: res.data.length || 0})
    })
  }
}

export default actions
