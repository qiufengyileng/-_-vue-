<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{detail.goods_price_min}}</span>
          <span class="oldprice">￥{{detail.goods_price_max}}</span>
        </div>
        <div class="sellcount">已售{{detail.goods_sales}}件</div>
      </div>
      <div class="msg text-ellipsis-2">
       {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{comTotal}}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in comList" :key="item.comment_id">
          <div class="top">
            <img :src=" item.user.avatar_url ||'https://img.51miz.com/Element/00/77/29/33/91080072_E772933_8c62ebf4.png' " alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="5" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
           {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home" @click="$router.push('/home')">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart"  @click="$router.push('/cart')">
        <van-icon name="shopping-cart-o" :badge="total"/>
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="addCart()">加入购物车</div>
      <div class="btn-buy" @click="buy()">立刻购买</div>
    </div>
    <van-action-sheet v-model="show" :title="mode==='buy'? '立即购买': '加入购物车'">
      <div class="product">
    <div class="product-title">
      <div class="left">
        <img :src="images[0].external_url" alt="">
      </div>
      <div class="right">
        <div class="price">
          <span>¥</span>
          <span class="nowprice">{{ detail.goods_price_min }}</span>
        </div>
        <div class="count">
          <span>库存</span>
          <span>{{ detail.stock_total }}</span>
        </div>
      </div>
    </div>
    <div class="num-box">
      <span>数量</span>
      <CountBox v-model="count"></CountBox>
    </div>
    <div class="showbtn" v-if=" detail.stock_total >0">
      <div class="btn" v-if="mode === 'cart'" @click="addcart">加入购物车</div>
      <div class="btn now" v-else @click="productToPay">立刻购买</div>
    </div>
    <div class="btn-none" v-else>该商品已抢完</div>
  </div>
</van-action-sheet>
  </div>
</template>

<script>
import { getProDetail, getProlistRow } from '@/api/porduct'
import CountBox from '@/components/CountBox.vue'
import { setCartSms } from '@/api/cart'
import { mapGetters } from 'vuex'
export default {
  name: 'ProDetail',
  components: {
    CountBox
  },
  async created () {
    const { data: { detail } } = await getProDetail(this.id)
    this.detail = detail
    this.images = detail.goods_images
    /* 获商品轮播图片 */
    const { data: { list, total } } = await getProlistRow(this.id)
    this.comList = list
    this.comTotal = total
    console.log(list)
    // console.log(detail)
    // this.getCartTotal()
    this.$store.dispatch('cart/getCartList')
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    ...mapGetters('cart', ['total'])

  },
  data () {
    return {
      images: [],
      current: 0,
      detail: {},
      comList: [],
      comTotal: 0,
      show: false,
      mode: '',
      count: 1,
      cartTotal: ''
    }
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    buy () {
      this.show = true
      this.mode = 'buy'
    },
    addCart () {
      this.show = true
      this.mode = 'cart'
    },
    async addcart () {
      if (!this.$store.state.user.userInfo.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请先完成登录再进行以下操作',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // on confirm
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        const res = await setCartSms(this.detail.goods_id, this.count, this.detail.skuList[0].goods_sku_id)
        if (res.message === '加入购物车成功') {
          this.$store.dispatch('cart/getCartList')
          this.$toast.success('加入购物车成功')
        } else {
          this.$toast.fail('出现错误了')
        }
        // console.log(res)
      }
    },
    productToPay () {
      if (!this.$store.state.user.userInfo.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请先完成登录再进行以下操作',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // on confirm
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'buyNow',
            goodsId: this.detail.goods_id,
            goodsNum: this.count,
            goodsSkuId: this.detail.skuList[0].goods_sku_id
          }
        })
      }
    }
    // async getCartTotal () {
    //   const res = await getCartSms()
    //   this.cartTotal = res.data.cartTotal
    // }
  }
}
</script>

<style lang="less" scoped>
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}
</style>
