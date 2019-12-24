import wepy from 'wepy'

export default class extends wepy.mixin {
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
    }
  }

  methods={
    //  选择收获地址
    async onChooseAddress() {
      const address = await wepy.chooseAddress()
      // 更改全局地址对象
      this.$parent.setAddress(address)
      this.$apply()
    }
  }
}
