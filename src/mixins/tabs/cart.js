import wepy from 'wepy'

export default class extends wepy.mixin {
  computed = {
    carts() {
      console.log(this.$parent.globalData.carts)
      return this.$parent.globalData.carts
    }
  }
}
