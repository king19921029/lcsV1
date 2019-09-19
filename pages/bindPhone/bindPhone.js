var app = getApp();
var util = require("../util/util.js");
var interval = null //倒计时函数
Page({
  data: {
    time:"发送验证码",
    currentTime: 60,
    phone: "",
    userCode:"",
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 获取验证码
  codeTap: function (e) {
    var that = this;
    let reg = /^1[34578][0-9]{9}$/;

    if (reg.test(this.data.phone)) {
      console.log(this.data.phone);
      app.wxRequest('api/apiservice/sms/v1/sendsms', { phone: this.data.phone, type: 1 }, 'POST', function (res) {
        console.log(res.data)
      })
      this.getCode();
      that.setData({
        disabled: true
      });

    } else {
     
      console.log("请输入正确的手机号")
    }


  },
  // 验证码倒计时
  getCode: function (options) {

    var that = this;
    // 验证码
    var currentTime = that.data.currentTime

    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: "请" + currentTime + '秒后再试'
      })
      console.log(currentTime);
      if (currentTime == 0 || currentTime < 0 ) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
   // 手机号
  phoneChange: function (e) {
    var that = this;
    let phone = e.detail.value;
    util.loginUtil.phoneChange(that, phone)
  },
  // 验证码
  codeChange: function (e) {
    var that = this;
    let code = e.detail.value;
    that.setData({
      userCode: code
    })
  },
  bindPhone:function(){
    var that = this;
    let phone = that.data.phone;
    let userCode = that.data.userCode;
    let unionId = app.globalData.unionId;
    let name = app.globalData.name;
    let iconUrl = app.globalData.iconUrl;
    
    app.wxRequest('api/apiservice/user/v1/bindPhone', { 
      phone: phone, 
      code: userCode,
      unionId: unionId,
      name: name,
      iconUrl: iconUrl
      }, 'POST', function (res) {
        console.log(res);
        if (res.data.code != 0) {
          app.showLoading(res.data.msg, "none");
        } else {
          app.showLoading("绑定成功", "success");
          wx.setStorageSync('token', res.data.data)
          app.globalData.token = res.data.data;
          app.globalData.header["x-authorization"] = res.data.data;
          wx.navigateBack({ delta: 2});
        }
    })

    // app.wxRequest('api/apiservice/sku/v1/userWXUnBindPhone', {
    //   unionId: unionId,
    // }, 'POST', function (res) {
    //   console.log(res.data)
    // })
  }

})