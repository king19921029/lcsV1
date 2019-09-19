var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_index:6,
    rmbData: [],
    wxBtn:false,
    user:{},
    pageInfoData: {
      comeDate: "",
      page_code: '6',
      page_info: '充值页'
    }

  },

  onLoad: function (options) {
    var that = this;
    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
      let initUser = res.data.data;
      that.setData({
        user: initUser
      })
      // console.log(res.data.data)

    })
    app.wxRequest('api/apiservice/meta/v1/getchargeitems', { }, 'POST', function (res) {
      // console.log(res.data)
      that.setData({
        rmbData:res.data.data
      })
    })
  },
  onShow: function () {
    var that = this;

    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = '充值页';

    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '6',
        page_info: '充值页'
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
  course_tab_switch(e) {
    
    var that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    console.log(id) 
    that.setData({
      course_index: index,
      chargeId:id
    });
  },
  radioChange: function (e) {
    console.log( e.detail.value)
  },
  wxBuy:function(){
    var that = this;
    if (that.data.chargeId ){
      let chargeId = String(that.data.chargeId);
      
      let openId = wx.getStorageSync("openId");
      app.wxRequest('api/apiservice/pay/v1/charge4wechatjsapiofxcx',
        { chargeId: chargeId, openid: openId },
        'POST', function (res) {
          console.log(res.data);
          let weChatPayINfo = res.data.data.weChatPayINfo
          wx.requestPayment({
            'timeStamp': weChatPayINfo.timestamp,
            'nonceStr': weChatPayINfo.noncestr,
            'package': weChatPayINfo.perpayid,
            'signType': 'MD5',
            'paySign': weChatPayINfo.sign,
            'success': function (res) {
              app.wxRequest('api/apiservice/user/v1/getuserinfo',
                {}, 'POST', function (res) {
                  let initUser = res.data.data;
                  that.setData({
                    user: initUser
                  })
                  console.log(res.data.data)

                })
              app.showLoading("充值成功")
            },
            'fail': function (res) {
              console.log(res);
            }
          })
      })
    }else{
      app.showLoading("请选择充值项","none")
    }
    
  }
})