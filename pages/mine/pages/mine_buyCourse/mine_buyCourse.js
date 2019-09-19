var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_index:3,
    header_items: [
      { title: '学习计划' },
      { title: '专题课' },
      { title: '订阅专栏' },
    ],
    getUserSkuList:{},//已购课程
    pageInfoData: {
      comeDate: "",
      page_code: '16',
      page_info: '已购课程页'
    },
  },

  onLoad: function (options) {
    var that = this;
    // 已购课程
    if (!that.data.getUserSkuList){
      console.log(that.data.getUserSkuList)
      app.showLoading("加载中","loading")
    }
    app.wxRequest('api/apiservice/sku/v1/getUserSkuList', {}, 'POST', function (res) {
        var getUserSkuList = res.data.data
        var labelArr = [];
        for (var i = 0; i < getUserSkuList.length; i++) {
          if (getUserSkuList[i].label) {
            var str = getUserSkuList[i].label.split(",");
            getUserSkuList[i].label = str;
          }
        }


      that.setData({
        getUserSkuList: getUserSkuList
      })
    })
  },
  onShow: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '16',
        page_info: '已购课程页'
      }
    })
    // 用户打开页面
    app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);

  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;

    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;
    app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);
  },
  // 切换
  course_tab_switch(e) {
    var that = this;
    let skuType = e.currentTarget.dataset.index;
    let status = "";
    this.getData(that, skuType)
    that.setData({
      course_index: skuType
    });
  },
  // 全部课程
  initCourse:function(){
    let that = this;
    app.wxRequest('api/apiservice/sku/v1/getUserSkuList', {}, 'POST', function (res) {
      var getUserSkuList = res.data.data
      var labelArr = [];
      for (var i = 0; i < getUserSkuList.length; i++) {
        if (getUserSkuList[i].label) {
          var str = getUserSkuList[i].label.split(",");
          getUserSkuList[i].label = str;
        }
      }
      that.setData({
        getUserSkuList: res.data.data,
        course_index:3
      })
    })
  },
  getData: function (that, skuType,status ) {
    // 课程
    app.wxRequest('api/apiservice/sku/v1/getUserSkuList', { skuType: skuType }, 'POST', function (res) {
      var getUserSkuList = res.data.data
      var labelArr = [];
      for (var i = 0; i < getUserSkuList.length; i++) {
        if (getUserSkuList[i].label) {
          var str = getUserSkuList[i].label.split(",");
          getUserSkuList[i].label = str;
        }
      }
      that.setData({
        getUserSkuList: res.data.data
      })
    })
  },
  // 通用跳转函数
  com_tap: function (e) {

    let dataType = e.currentTarget.dataset.type;
    let dataId = e.currentTarget.dataset.text;

    if (dataType == 0) {
      wx.navigateTo({
        url: '../../../home/pages/home_planDetails/home_planDetails?text=' + dataId,
      })
    }
    if (dataType == 1) {
      wx.navigateTo({
        url: '../../../home/pages/home_specialDetails/home_specialDetails?text=' + dataId,
      })
    }
    if (dataType == 2) {
      wx.navigateTo({
        url: '../../../home/pages/home_columnDetails/home_columnDetails?text=' + dataId,
      })
    }
    if (dataType == 3) {
      console.log("网页")
    }
  },

})