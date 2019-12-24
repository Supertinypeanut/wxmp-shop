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
    onSubmitOrder() {
      console.log(77)
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

      this.$apply()
    }
  }
}
