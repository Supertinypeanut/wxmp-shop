import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 联想数据
    responseData: [],
    // 定时器器id
    timer: undefined
  }

  methods = {
    // 监听搜索框改变
    onChange(e) {
      // 清除上次定时器
      clearTimeout(this.timer)
      // 防抖处理
      this.timer = setTimeout(async() => {
      // 搜索关键词
        const query = String.prototype.trim.call(e.detail)
      // 对搜索词进行非空校验和请求是否完成校验
        if (!query) {
          return
        }

      // 发送请求
        const { data } = await wepy.get('goods/qsearch', {query})
        // 判断是请求成功
        if (data.meta.status !== 200) {
          return wepy.baseToast()
        }
      // 更新响应数据
        this.responseData = data.message
        this.$apply()
      }, 500)
    },

    // 点击下拉联想跳转详情页
    onSearchTo(id) {
      console.log(id)
      wepy.navigateTo({
        url: `/pages/goods_detail/index?goods_id=${id}`
      })
    }
  }
  onShow () {
      // 设置购物车选中徽标数量
    this.$parent.setTabBarBadge()
  }
}
