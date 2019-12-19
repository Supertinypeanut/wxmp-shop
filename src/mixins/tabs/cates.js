import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    vh: 0,  // 视口高度
    categories: {}, // 分类数据
    currentItem: {},  // 当前首页数据
    activeKey: 0, // 点击索引
    scrollTpo: 0 // 右侧高度
  }

  methods = {
      // 更该当前选择对象
    onChoose(e) {
      this.activeKey = e.detail
      this.currentItem = this.categories[this.activeKey]

      // 每次切换让滚动条回到顶部，但要是值都一样，滚动条就不会变
      this.scrollTpo = this.scrollTpo - 1
    },

    // 处理跳转到数据列表
    onToGoodsList(cid) {
      console.log(cid)
      wepy.navigateTo({
        url: '/pages/goods_list/index?cid=' + cid
      })
    }
  }

  onLoad() {
      // 获取屏幕高度
    this.getScreenHeight()

      // 获取分类数据
    this.getCategories()
  }

  async getScreenHeight() {
      // 获取系统信息
    const sysInfo = await wepy.getSystemInfo()
    this.vh = sysInfo.windowHeight
    this.$apply()
  }

  async getCategories() {
      // 获取分类信息
    const { data } = await wepy.get('categories')
    this.categories = data.message
    this.currentItem = data.message[0]
    this.$apply()
  }
  }
