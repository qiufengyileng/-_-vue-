import request from '@/utils/request'
// 获取图片验证码
export const getPicCode = () => {
  return request.get('/captcha/image')
}
// 获取手机验证码
export const getCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha',
    {
      form: {
        captchaCode,
        captchaKey,
        mobile
      }
    }
  )
}
// 登入校验
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      smsCode,
      mobile,
      isParty: false,
      partyData: {}

    }
  })
}
