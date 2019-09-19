var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageInfoData: {
      comeDate: "",//进入页面时间
      page_code: '11',
      page_info: '已学完课程'
    },
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    var that = this;
    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = '已学完课程';

    // 用户进入页面时间
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '11',
        page_info: '已学完课程'
      }
    })
    // 用户打开页面
    app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);

    app.wxRequest('api/apiservice/sku/v1/getUserFinishSku', { }, 'POST', function (res) {
      console.log(res.data)
    })
  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;

    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;

    app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);
  },
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})