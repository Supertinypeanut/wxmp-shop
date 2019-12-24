import wepy from 'wepy'

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
        // 创建订单
      const res = await wepy.post('my/orders/create', {
        order_price: this.goodsTotal,
        consignee_addr: this.addressStr,
        goods: this.goods
      })

      // 对订单响应处理判断
      if (res.errMsg !== 'request:ok') {
        return wepy.baseToast('创建订单失败')
      }

    // 获取订单编号
      const order_number = res.data.message || 'test123456'

    //   wepy.navigateTo({
    //       url:''
    //   })
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
      const tokenRes = await wepy.post('users/wxlogin', wxloginQuery)
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
}
