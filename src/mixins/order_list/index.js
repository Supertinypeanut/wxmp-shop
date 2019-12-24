import wepy from 'wepy'

export default class extends wepy.mixin {
  data ={
    // 当前激活页
    active: 0,
    // 订单列表
    order: []
  }

  methods = {
    onChange(e) {
      // 更新active
      this.active = e.detail.index
      // 更新订单列表
      this.getOrders()
    }
  }

  // 获取订单列表
  async getOrders() {
    //  获取类型
    const type = this.active + 1
    const {data: res} = await wepy.get('my/orders/all', { type }).catch(err => err)

    // 校验订单列表数据请求是否成功
    if (res.meta.status !== 200) {
      return wepy.baseToast('订单列表数据获取失败')
    }

    // 测试数据
    let test = {
      'count': 1,
      'orders': [
        {
          'order_id': 428,
          'user_id': 23,
          'order_number': 'HMDD20190802000000000428',
          'order_price': 13999,
          'order_pay': '0',
          'is_send': '否',
          'trade_no': '',
          'order_fapiao_title': '个人',
          'order_fapiao_company': '',
          'order_fapiao_content': '',
          'consignee_addr': '广东省广州市海珠区新港中路397号',
          'pay_status': '1',
          'create_time': 1564731518,
          'update_time': 1564731518,
          'order_detail': null,
          'goods': [
            {
              'id': 717,
              'order_id': 428,
              'goods_id': 43986,
              'goods_price': 13999,
              'goods_number': 1,
              'goods_total_price': 13999,
              'goods_name': '海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统',
              'goods_small_logo': 'http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg'
            }
          ],
          'total_count': 1,
          'total_price': 13999
        }
      ]
    }

    test = res.message || test
    return test
  }

  onLoad() {
    this.getOrders()
  }
}
