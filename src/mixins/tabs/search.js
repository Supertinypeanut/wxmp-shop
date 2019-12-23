import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    responseData: []
  }

  methods = {
        // 监听搜索框改变
    async onChange(e) {
          // 搜索关键词
      const query = e.detail
          // 发送请求
      const { data } = await wepy.get('goods/qsearch', {query})
          // 判断是请求成功
      if (data.meta.status !== 200) {
        return wepy.baseToast()
      }
          // 更新响应数据
      this.responseData = data.message
      this.$apply()
    }
  }
  onShow () {
      // 设置购物车选中徽标数量
    this.$parent.setTabBarBadge()
  }
}
