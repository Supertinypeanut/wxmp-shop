import wepy from 'wepy'
// Toast轻提示
import Toast from '../../assets/vant/toast/toast'

export default class extends wepy.mixin {
  data = {
    // 登录请求参数对象
    wxloginQuery: null
  }

  computed = {
    // 获取收获地址对象
    address() {
      return this.$parent.globalData.address
    },

    // 地址拼接
    addressStr() {
        // 接收地址对象
      const address = this.address
      if (!address) {
        return ''
      }
      return address.provinceName + address.cityName + address.countyName + address.detailInfo
    },

    // 勾选商品列表
    chooseGoods() {
      return this.$parent.globalData.carts.filter(item => item.isChoose)
    },

    // 商品总价
    goodsTotal() {
      let total = 0
      this.chooseGoods.forEach(item => { total += item.num * item.price })
      return total * 100
    },

    // 获取token对象
    token() {
      return this.$parent.globalData.token
    },

    // 创建订单的goods字段
    goods() {
      let params = []
      this.chooseGoods.forEach(item => {
        params.push({
          goods_id: item.id,
          goods_number: item.num,
          goods_price: item.price
        })
      })
      return params
    }
  }

  methods = {
    //  选择收获地址
    async onChooseAddress() {
      const address = await wepy.chooseAddress()
      // 更改全局地址对象
      this.$parent.setAddress(address)
      this.$apply()
    },

    // 支付按钮
    async onSubmitOrder() {
      // 获取订单编号
      const order_number = await this.newOrder()

      // 获取支付参数
      const payParams = await this.getPayParams(order_number)

      //   发起微信支付
      const res = await wepy.requestPayment({
        timeStamp: payParams.pay.timeStamp,
        nonceStr: payParams.pay.nonceStr,
        package: payParams.pay.package
      }).catch(err => err)

      // 校验微信支付是否成功
      if (res.errMsg !== 'response:ok') {
        return wepy.baseToast('支付失败！')
      }

      // 支付成功倒计时三秒跳转订单页
      const toast = Toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '支付成功，3秒后跳转',
        loadingType: 'spinner',
        selector: '#custom-selector'
      })
      let second = 3
      const timer = setInterval(() => {
        second--
        if (second) {
          toast.setData({
            message: `支付成功，${second}秒后跳转`
          })
        } else {
          clearInterval(timer)
          Toast.clear()

          // 跳转到订单列表页
          wepy.navigateTo({
            url: '/pages/order_list/index'
          })
        }
      }, 1000)
    },

    // 获取用户信息
    async getUserInfo(userInfo) {
        // 校验是否获取用户成功
      if (!userInfo) {
        return wepy.baseToast('授权失败')
      }

      // 获取code
      const res = await wepy.login()
      // 校验是否获取code成功
      if (res.errMsg !== 'login:ok') {
        return wepy.baseToast('授权失败')
      }

      // 获取对象对应的属性
      const { encryptedData, rawData, iv, signature, code } = {...res, ...userInfo.detail}

      // 处理请求参数对象
      const wxloginQuery = {
        encryptedData,
        rawData,
        iv,
        signature,
        code
      }
      // 更新用户登录请求对象
      this.wxloginQuery = wxloginQuery

      // 获取token
      const tokenRes = await wepy.post('users/wxlogin', wxloginQuery).catch(err => err)
      // 校验token是否成功
      if (tokenRes.errMsg !== 'request:ok') {
        return wepy.baseToast('token获取失败')
      }

      const token = tokenRes.data.message || 'Bearer token'
      // 设置全局token
      this.$parent.setToken(token)
      this.$apply()
    }
  }

    // 创建订单
  async newOrder() {
    const res = await wepy.post('my/orders/create', {
      order_price: this.goodsTotal,
      consignee_addr: this.addressStr,
      goods: this.goods
    }).catch(err => err)

          // 对订单响应处理判断
    if (res.errMsg !== 'request:ok') {
      return wepy.baseToast('创建订单失败')
    }

          // 获取订单编号
    const order_number = res.data.message || 'test123456'
          // 订单添加到全局订单数组
    this.$parent.addOrder(res.data)

    return order_number
  }

  // 获取支付参数
  async getPayParams(order_number) {
    //   请求获取支付参数
    let payParams = await wepy.post('my/orders/req_unifiedorder', {order_number}).catch(err => err)

    // 校验支付参数是否获取成功
    if (payParams.errMsg !== 'request:ok') {
      return wepy.baseToast('支付参数获取失败')
    }
    // 测试参数
    const testParams = {
      pay: {
        timeStamp: '1564730510',
        nonceStr: 'SReWbt3nEmpJo3tr',
        package: 'prepay_id=wx02152148991420a3b39a90811023326800',
        signType: 'MD5',
        paySign: '3A6943C3B865FA2B2C825CDCB33C5304'
      },
      order_number: 'HMDD20190802000000000422'
    }
    payParams = payParams.data.message || testParams
    return payParams
  }
}
