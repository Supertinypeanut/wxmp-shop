import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    swiperList: [], // 轮播图数据
    catitemsList: [], // 导航
    floordata: {} // 楼层数据
  }

  methods = {
    // 页面跳转
    onNavigateTo(url) {
      wepy.navigateTo({
        url: url
      })
    }
  }

  onLoad() {
    // 获取轮播图
    this.getSwiperList()
    // 获取导航
    this.getCatitemsList()
    // 获取楼层
    this.getFloordata()
  }

  async getSwiperList() {
    const {data} = await wepy.get('home/swiperdata')
    // 判断是否请求成功，提示
    if (data.meta.status != 200) {
      return wepy.baseToast()
    }
    this.swiperList = data.message
    this.$apply()
  }

  async getCatitemsList() {
    const {data} = await wepy.get('home/catitems')
    // 判断是否请求成功，提示
    if (data.meta.status != 200) {
      return wepy.baseToast()
    }
    this.catitemsList = data.message
    this.$apply()
  }

  async getFloordata() {
    const {data} = await wepy.get('home/floordata')
    // 判断是否请求成功，提示
    if (data.meta.status != 200) {
      return wepy.baseToast()
    }
    this.floordata = data.message
    this.$apply()
  }
}
