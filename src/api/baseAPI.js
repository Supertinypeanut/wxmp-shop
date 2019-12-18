import wepy from 'wepy'

// 基地址
const baseURL = 'https://uinav.com/api/public/v1/'

// 封装消息提示
wepy.baseToast = function(str = '数据获取失败！'){
    wepy.showToast({
        title: str,
        duration: 1500,
        icon: 'none'
    })
}

// 封装get请求
wepy.get = function(url,data = {}){
    return wepy.request({
        method: 'GET',
        url: baseURL + url,
        data
    })
}

// 封装post请求
wepy.post = function(url,data = {}){
    return wepy.request({
        method: 'POST',
        url: baseURL + url,
        data
    })
}