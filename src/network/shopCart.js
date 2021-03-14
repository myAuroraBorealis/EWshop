import {request} from "./request";

//添加购物车
export function addCartItem(data) {
  return request({
    url: '/api/carts',
    method: 'post',
    data
  })
}

//修改购物车，data = {num: Number}
export function modifyCartItem(id,data) {
  return request({
    url: `/api/carts/${id}`,
    method: 'put',
    data
  })
}

//选择商品的状态,所有商品的ID
export function checkCartItem(data) {
  return request({
    url: '/api/carts/checked',
    method: 'patch',
    data
  })
}

//获取购物车列表
export function getCartAllItem(data = '') {
  return request({
    url: '/api/carts?',
    params: {
      include: data
    }
  })
}

//删除购物车
export function deleteCartItem(id) {
  return request({
    url: `/api/carts/${id}`,
    method: 'delete'
  })
}
