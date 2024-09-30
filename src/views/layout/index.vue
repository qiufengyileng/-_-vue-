<template>
  <div>Layout
  <router-view></router-view>
    <!-- 下标签 -->
    <van-tabbar v-model="active" route>
  <van-tabbar-item to="/home" icon="home-o" >首页</van-tabbar-item>
  <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
  <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
  <van-tabbar-item to="/user" icon="manager-o">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutVue',
  data () {
    return {
      active: 0
    }
  }
}
</script>
<style>

</style>
