var app = getApp();
var util = require("../util/util.js");
var interval = null //倒计时函数
Page({

  data:{
    currentTime: 60,
    loginType:1,//登录方式
    time: '获取验证码',
    phone: "",
    codeBtn: true,//获取验证码按钮
    timeBtn: false,//验证码倒计时按钮
    code:"",//验证码
    password:"",//密码
    userCode:"",//用户输入的验证码
  },

  onLoad: function () {

  },
  onShow: function () {
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
  passwordChange:function(e){
    var that = this;
    let password = e.detail.value;
    that.setData({
      password: password
    })
  },
  // 验证码
  codeChange: function (e) {
    var that = this;
    let code = e.detail.value;
    that.setData({
      userCode: code
    })
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
  // 确定验证码是否正确
  isCode:function(){
    let num = 1;

    app.wxRequest('api/apiservice/user/v1/login', { phone: this.data.phone, code: this.data.userCode, type: num }, 'POST', 
      function (res)   {
        console.log(res.data)
        if (res.data.msg){
          console.log(res.data.msg)
        }else{

          wx.setStorageSync('token', res.data.data)
          console.log(res.data.data)

          app.globalData.token = res.data.data;
          app.globalData.header["x-authorization"] = res.data.data;

          //跳转页面
          wx.switchTab({
            url: '../home_index/home_index',
          })
        }
        
      }
    )
    
    
  },
  //去密码登录
  go_passwordLogin:function(){
    // wx.navigateTo({
    //   url: '../passwordLogin/passwordLogin',
    // })
    wx.redirectTo({
      url: '../passwordLogin/passwordLogin',
    })
  },
  //去注册
  go_register: function () {
    wx.navigateTo({
      url: '../go_register/go_register',
    })
  },
  userProtocol:function(){
    // wx.navigateTo({
    //   url: '',
    // })
    console.log(1)
  }


})