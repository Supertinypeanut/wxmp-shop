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

  computed = {
    address() {
      const params = this.$parent.globalData.address
      return params
        ? params.provinceName +
          params.cityName +
          params.countyName +
          params.detailInfo
        : '请选择收货地址'
    }
  }

  methods = {
    // 图片全屏预览
    perview(url) {
      wepy.previewImage({
        urls: this.goods.pics.map(item => item.pics_big_url),
        current: url
      })
    },

    // 选择地址
    async chooseAddress() {
      // 微信地址API
      const res = await wepy.chooseAddress().catch(err => err)
      this.$parent.setAddress(res)
      this.$apply()
    }
  }

  // 请求商品详情数据
  async getDetail(id) {
    const { data } = await wepy.get('goods/detail', { goods_id: id })

    // 数据获取失败
    if (data.meta.status !== 200) {
      return wepy.baseToast()
    }

    // 把所有 .webp 后缀名结尾的图片,替换为 .jpg
    data.message.goods_introduce = data.message.goods_introduce.replace(
        /\.webp/g,
        '.jpg'
      )
    this.goods = data.message
    this.$apply()
  }
}
