var app = getApp();

Page({

  data: {
    phone: "",
    loginType:0,//登录方式
    codeBtn: true,//获取验证码按钮
    timeBtn: false,//验证码倒计时按钮
    password: "",//密码
    userCode: "",//用户输入的验证码
    pageInfoData: {
      comeDate: "",
      page_code: '17',
      page_info: '登录页'
    },
  },

  onLoad: function () {
    // let token = wx.getStorageSync("token");
    // app.globalData.header["x-authorization"] = token;
    // console.log(app.globalData.header);
  },
  onShow: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '17',
        page_info: '登录页'
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
  // 手机号
  phoneChange: function (e) {
    var that = this;
    let phone = e.detail.value;
    let reg = /^1[3456789][0-9]{9}$/;

    if (reg.test(phone)) {
      that.setData({
        phone: phone
      })
    } else {
      wx.showToast({
        title: "手机号输入有误",
        icon: "none"
      })
    }

  },
  //密码
  passwordChange: function (e) {
    var that = this;
    let password = e.detail.value;
    that.setData({
      password: password
    })
  },
  // 去忘记密码
  go_forgetPassword: function (e) {
    wx.navigateTo({
      url: '../forgetPassword/forgetPassword',
    })
  },
  // 去注册
  go_register:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  // 确定按钮
  isPassword: function () {
    let loginType = this.data.loginType;
    app.wxRequest('api/apiservice/user/v1/login', 
      { phone: this.data.phone, password: this.data.password,type: loginType }, 'POST',
      function (res) {
        console.log(res);
        if (res.data.code != 0) {
          let msg = res.data.msg;
          wx.showToast({
            title: msg,
            icon: "none"
          })
        } else {
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
  // 去验证码登录页
  go_login:function(){
    wx.redirectTo({
      url: '../login/login',
    })
  },
  bindGetUserInfo:function(e){
    var that = this;
    console.log(e.detail.userInfo);
    app.showLoading("正在登录", "loading");
    let unionId = app.globalData.unionId;
    app.globalData.nickName = e.nickName;
    app.globalData.iconUrl = e.avatarUrl;

    app.wxRequest('api//apiservice/user/v1/wxLogin', { 
      unionId: unionId,
      name: e.nickName,
      iconUrl: e.avatarUrl
    }, 'post', function (res) {
      console.log(res);

      if (res.data.code != 0){
        app.showLoading(res.data.msg,"none");
        wx.navigateTo({
          url: '../bindPhone/bindPhone',
        })
      }else{
        app.showLoading("正在登陆", "loading");
        wx.setStorageSync('token', res.data.data)
        console.log(res.data.data)
        app.globalData.token = res.data.data;
        app.globalData.header["x-authorization"] = res.data.data;
        wx.navigateBack();
      }
    })
  },
})