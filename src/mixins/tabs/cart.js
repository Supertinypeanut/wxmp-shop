import wepy from 'wepy'

export default class extends wepy.mixin {
  methods = {
    //  更改选中状态
    onChooseChange(e) {
      // 获取id和done
      const id = e.target.dataset.id
      const done = e.detail
      // 触发全局修改选中状态事件
      this.$parent.changeGoodsChoose(id, done)
    },

    // 全选按钮
    onAllChooseChange(e) {
      // 获取选中状态
      const done = e.detail
      // 触发全局全选事件
      this.$parent.changeAllGoodsChoose(done)
    },

    // 修改商品数量
    onNumChange(e) {
      // 获取id和value
      const id = e.target.dataset.id
      const value = parseInt(e.detail) || 1

      // 触发全局修改商品数量
      this.$parent.changeGoodsNum(id, value)
    },

    // 到商品详情页
    onNavigateTo(id) {
      console.log(id)
      wepy.navigateTo({
        url: `/pages/goods_detail/index?goods_id=${id}`
      })
    },

    // 提交订单
    onSubmitOrder(e) {
      wepy.navigateTo({
        url: '/pages/order_list/index'
      })
    }
  }

  computed = {
    // 购物车数据列表
    carts() {
      return this.$parent.globalData.carts
    },

    // 购物车全选状态
    allDone() {
      return this.$parent.globalData.carts.every(item => item.isChoose)
    },

    // 获取合计
    total() {
      let params = 0
      // 计算所有选中商品的价格
      this.$parent.globalData.carts.forEach(item => {
        if (item.isChoose) {
          params += item.num * item.price
        }
      })
      return params * 100
    }
  }

  onShow () {
    // 设置购物车选中徽标数量
    this.$parent.setTabBarBadge()
  }
}
