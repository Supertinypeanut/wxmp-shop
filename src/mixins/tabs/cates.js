import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
      vh: 0,  // 视口高度
      categories: {}, // 分类数据
      currentItem: {}  // 当前首页数据
    }
  
    methods = {
      // 更该当前选择对象
      onChoose(item){
        this.currentItem = item
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