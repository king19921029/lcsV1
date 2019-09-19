var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexSubjectSkuList:{},//课程列表
    platform: null,//手机系统
  },
  onLoad: function (options) {
    var that = this;
    let id = options.id
    let title = options.title;
    wx.setNavigationBarTitle({
      title: title
    })
    app.wxRequest('api/apiservice/sku/v1/indexSubjectSkuList', { subjectId: id }, 'POST', function (res) {
      var arr = res.data.data;
      for (var i = 0; i < arr.length; i++) {

        if (arr[i].label) {
          var str = arr[i].label.split(",");
          arr[i].label = str;
        }

      }
      console.log(arr);
      that.setData({
        indexSubjectSkuList: arr,
        platform: app.globalData.platform
      })
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  // 课程跳转到详情
  to_details(e) {
    let dataType = e.currentTarget.dataset.type;
    let dataId = e.currentTarget.dataset.text;
    if (dataType == 0) {
      wx.navigateTo({
        url: '../home_planDetails/home_planDetails?text=' + dataId,
      })
    }
    if (dataType == 1) {
      wx.navigateTo({
        url: '../home_specialDetails/home_specialDetails?text=' + dataId,
      })
    }
    if (dataType == 2) {
      wx.navigateTo({
        url: '../home_columnDetails/home_columnDetails?text=' + dataId,
      })
    }
    if (dataType == 3) {
      console.log("网页")
    }
  },
})