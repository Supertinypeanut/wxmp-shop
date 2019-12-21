import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品所有信息
    goods: {}
  }
  onLoad(options) {
    // 获取数据商品详情
    this.getDetail(options.goods_id)
  }

  methods = {
    // 图片全屏预览
    perview(url) {
      wepy.previewImage({
        urls: this.goods.pics.map(item => item.pics_big_url),
        current: url
      })
    }
  }

  // 请求商品详情数据
  async getDetail(id) {
    const { data } = await wepy.get('goods/detail', { goods_id: id })

    // 数据获取失败
    if (data.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.goods = data.message
    this.$apply()
  }
}
