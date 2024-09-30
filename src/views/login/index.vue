<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input class="inp" maxlength="11" v-model="mobile" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input class="inp" maxlength="5"   v-model="picCode" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl"  @click="getPicCode">
        </div>
        <div class="form-item">
          <input class="inp" v-model="smsCode" placeholder="请输入短信验证码" type="text">
          <button @click="getCode($event)" :disabled="disabled">发送验证码</button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>
<script>
import { getPicCode, getCode, codeLogin } from '@/api/login'
let id = null
export default {
  name: 'LoginPage',
  data () {
    return {
      picCode: 'wwww',
      picKey: '',
      picUrl: '',
      disabled: false,
      timer: null,
      mobile: '15751776629',
      code: '',
      smsCode: '246810'
    }
  },
  async created () {
    this.getPicCode()
  },
  methods: {
    getPicCode () {
      clearTimeout(id)
      id = setTimeout(async () => {
        const { data: { base64, key } } = await getPicCode()
        this.picUrl = base64
        this.picKey = key
      }, 300)
    },
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('图形验证码错误')
        return false
      }
      return true
    },
    async  getCode (e) {
      if (!this.validFn()) {
        return
      }
      this.disabled = true
      this.code = (await getCode(this.picCode, this.picKey, this.mobile)).message
      this.$toast('验证码发送成功')
      console.log('this code', this.code)
      let second = 50
      e.target.innerHTML = `${second}秒后重新发送`
      this.timer = setInterval(() => {
        second--
        if (second >= 1) {
          e.target.innerHTML = `${second}秒后重新发送`
        } else {
          e.target.innerHTML = '重新发送验证码'
          clearInterval(this.timer)
          this.disabled = false
        }
      }, 1000)
    },
    async login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.smsCode)) {
        return this.$toast('验证码错误')
      }
      const res = await codeLogin(this.mobile, this.smsCode)
      this.$store.commit('user/setUserInfo', res.data)
      this.$toast('登入成功')
      const url = this.$route.query.backUrl || '/home'
      this.$router.replace(url)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}

</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
