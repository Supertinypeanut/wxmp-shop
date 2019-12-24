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

  onShow() {

  }
}
