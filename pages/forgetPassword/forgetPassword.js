var app = getApp();
var util = require("../util/util.js");
var interval = null //倒计时函数
Page({

  data: {
    phone: "",
    currentTime: 60,
    time: '获取验证码',
    code: "",
    userCode: "",//用户输入的验证码
    password: "",//第一次输入密码
    isPassword: "",//确认密码
    pageInfoData: {
      comeDate: "",
      page_code: '19',
      page_info: '修改密码'
    },
  },

  onLoad: function (options) {
    // wx.clearStorage()
  },

  onShow: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '19',
        page_info: '修改密码'
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

      if (currentTime <= 0) {
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
  // 密码
  passwordChange: function (e) {
    var that = this;
    let password = e.detail.value;
    that.setData({
      password: password
    })
  },
  // 确认密码
  isPasswordChange: function (e) {
    var that = this;
    let isPassword = e.detail.value;

    that.setData({
      isPassword: isPassword
    })

  },
  //验证码
  codeChange: function (e) {
    var that = this;
    let code = e.detail.value;
    that.setData({
      userCode: code
    })
  },

  // 18801287297
  // 18301176614

  // 获取验证码
  codeTap: function (e) {
    var that = this;
    let reg = /^1[34578][0-9]{9}$/;

    if (reg.test(this.data.phone)) {

      app.wxRequest('api/apiservice/sms/v1/sendsms', { phone: this.data.phone, type: 0 }, 'POST', function (res) {
        console.log(res.data)
        that.setData({
          code: res.data.code
        })
      })

      this.getCode();
      that.setData({
        disabled: true
      });

    } else {

      // console.log("请输入正确的手机号")
    }


  },
  // 下一步验证
  isCode: function () {
    var that = this;

    let reg = /^1[34578][0-9]{9}$/;

    let phone = that.data.phone;
    let userCode = that.data.userCode;
    let password = that.data.password;
    let isPassword = that.data.isPassword;

    if (password == isPassword) {
      console.log("手机号:" + phone);
      console.log("验证码:" + userCode);
      console.log("第一次密码：" + password);
      console.log("确认密码：" + isPassword);

      app.wxRequest('api/apiservice/user/v1/updatepwd', {type:2, phone: phone, password: isPassword, code: userCode }, 'POST',
        function (res) {
          console.log(res);
          if (res.data.code == 0){
            wx.navigateTo({
              url: '../passwordLogin/passwordLogin',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
            
        }
      )
    } else {
      wx.showToast({
        title: '两次密码输入不正确',
        icon: "none"
      })
    }

  },



})