import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 联想数据
    responseData: [],
    // 定时器器id
    timer: undefined
  }

  computed = {
    //  历史记录
    history() {
      return this.$parent.globalData.history
    },

    // 是否显示历史记录
    showHistory() {
      return this.responseData.length === 0
    }
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
          // 清空联想数组
          this.responseData = []
          this.$apply()
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

    // 搜索事件
    onSearch(e) {
      const str = String.prototype.trim.call(e.detail)
      if (!str) {
        return
      }
      this.responseData = []
      // 更新全局历史记录
      this.$parent.setHistory(str)
      this.$apply()
      wepy.navigateTo({
        url: `/pages/goods_list/index?query=${str}`
      })
    },

    // 清空搜索框内容
    onCancel() {
      this.responseData = []
      this.$apply()
    },

    // 点击下拉联想跳转详情页
    onSearchTo(id) {
      // 清空下拉联想
      this.responseData = []
      wepy.navigateTo({
        url: `/pages/goods_detail/index?goods_id=${id}`
      })
    },

    // 点击历史记录跳转商品列表页
    onQueryHistory(queryStr) {
      wepy.navigateTo({
        url: `/pages/goods_list/index?query=${queryStr}`
      })
    }
  }
  onShow () {
      // 设置购物车选中徽标数量
    this.$parent.setTabBarBadge()
  }
}
