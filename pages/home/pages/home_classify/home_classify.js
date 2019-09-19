var app = getApp();
Page({

 
  data: {
    
  },

 
  onLoad: function (options) {
    var that = this;
    // 正式 学习计划banner接口
    app.wxRequest('api/apiservice/sku/v1/getAppAllCategoryList',
      {}, 'POST', function (res) {
        console.log(res.data.data)
        that.setData({
          banner: res.data.data
        })
    })

  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  
})