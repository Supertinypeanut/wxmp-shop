import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品所有信息
    message: {}
  }
  onLoad(options) {
    // 获取数据商品详情
    this.getDetail(options.goods_id)
  }

  //
  async getDetail(id) {
    const { data } = await wepy.get('goods/detail', { goods_id: id })
    this.message = data.message
  }
}
