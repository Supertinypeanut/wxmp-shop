import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    dataList: {}, // 数据列表
    query: { // 请求参数
      pagenum: 1,
      pagesize: 10
    },
    total: 0,  // 总条数
    isRequest: false  // 是否在请求
  }

  onLoad(id) {
    // 合并请求参数
    this.query = {...this.query, ...id}

    // 更新数据
    this.getDataList()
  }

  // 上拉加载更多
  onReachBottom() {
    // 判断是否还需请求数据
    if (this.total <= this.query.number * this.query.pagesize) {
      return
    }

    // 判断是否请求在请求，节流
    if (this.isRequest) {
      return
    }

    this.getDataList()
    // 让请求页码加1
    this.query.pagenum++
  }

  // 请求列表数据
  async getDataList() {
    // 更改为请求状态
    this.isRequest = true

    const { data } = await wepy.get('goods/search', this.query)
    // 更新数据列表
    this.dataList = [...this.dataList, ...data.message.goods]
    // 获取总条数
    this.total = data.message.total
    // 更改为未请求状态
    this.isRequest = false
    this.$apply()
  }
}
