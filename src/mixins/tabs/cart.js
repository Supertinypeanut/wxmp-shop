import wepy from 'wepy'

export default class extends wepy.mixin {
  methods = {
    //  更改选中状态
    onChooseChange(e) {
      console.log(e)
      // 获取id和done
      const id = e.target.dataset.id
      const done = e.detail
    // 触发全局修改选中状态事件
      this.$parent.changeGoodsChoose(id, done)
    }
  }
  computed = {
    // 购物车数据列表
    carts() {
      return this.$parent.globalData.carts
    }
  }
}
