<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="order.goodsList">
        <div class="info-content">
          <span class="name">{{ chooseAddress.name }}</span>
          <span class="mobile">{{ chooseAddress.phone }}</span>
        </div>
        <div class="info-address">
      {{ AddressDetail }}
        </div>
      </div>

      <div class="info" v-else>
        请选择配送地址
      </div>

      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list"  v-for="item in order.goodsList" :key="item.goods_id">
        <div class="goods-item">
            <div class="left">
              <img :src="item.goods_image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                {{ item.goods_name }}
              </p>
              <p class="info">
                <span class="count">x{{ item.total_num ||0 }}</span>
                <span class="price">¥{{ item.goods_price_min }}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ order.orderTotalNum }} 件商品，合计：</span>
        <span class="money">￥{{ order.orderPayPrice }}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{  order.orderPayPrice }}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span  v-if="!chooseAddress">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ {{ balance }} 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10" v-model="remark"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{order.orderTotalPrice}}</span></div>
      <div class="tipsbtn" @click="buy">提交订单</div>
    </div>
  </div>
</template>

<script>
import { getCheckOrder, buyOrder, money } from '@/api/order'
import { getAddressList } from '@/api/address'
export default {
  name: 'PayIndex',
  data () {
    return {
      addressList: [],
      order: {},
      personal: {},
      remark: '',
      balance: ''
    }
  },
  async created () {
    this.searchAddressList()
    this.getToPay()
    const { data: { assets: { balance } } } = await money()
    this.balance = balance
  },
  computed: {
    chooseAddress () {
      return this.addressList[0] || {}
    },
    AddressDetail () {
      const region = this.chooseAddress.region
      const address = region.province + ' ' + region.city + ' ' + region.region + ' ' + this.chooseAddress.detail
      return address
    },
    mode () {
      return this.$route.query.mode
    },
    cartIds () {
      return this.$route.query.cartIds
    },
    goodsSkuId () {
      return this.$route.query.goodsSkuId
    },
    goodsId () {
      return this.$route.query.goodsId
    },
    goodsNum () {
      return this.$route.query.goodsNum
    }
  },
  methods: {
    async  buy () {
      if (this.mode === 'cart') {
        await buyOrder(this.mode, {
          cartIds: this.cartIds,
          remark: this.remark
        })
      } else {
        await buyOrder(this.mode, {
          goodsNum: this.goodsNum,
          goodsId: this.goodsId,
          goodsSkuId: this.goodsSkuId,
          remark: this.remark
        })
      }
      this.$toast.success('支付成功')
      this.$router.replace('/myorder')
      const { data: { assets: { balance } } } = await money()
      this.balance = balance
    },
    async searchAddressList () {
      const { data: { list } } = await getAddressList()
      this.addressList = list
      console.log(this.addressList)
    },
    async getToPay () {
      if (this.mode === 'cart') {
        const { data: { order, personal } } = await getCheckOrder(this.mode, {
          cartIds: this.cartIds
        })
        this.order = order
        this.personal = personal
      } else {
        const { data: { order, personal } } = await getCheckOrder(this.mode, {
          goodsNum: this.goodsNum,
          goodsId: this.goodsId,
          goodsSkuId: this.goodsSkuId
        })
        this.order = order
        this.personal = personal
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
