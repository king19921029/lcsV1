var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  data: {
    phone:"",
  },
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.userPhone
    })
  },
  onShow: function () {
    
  },
  onHide: function () {

  },
  userQuit:function(){
    wx.removeStorageSync('token')
    app.globalData.token = "";
    backgroundAudioManager.stop();
    app.globalData.isMicPlay = false;
    wx.showToast({
      title:"已退出登录",
      icon: "none"
    })
    var timer = setTimeout(function () {
      wx.switchTab({
        url: '../../../home_index/home_index'
      })
    }, 1000)

   
  },
  go_revisePassword(){
    wx.navigateTo({
      url: '../../../revisePassword/revisePassword',
    })
  },
  go_userProtocol(){
      wx.navigateTo({
        url: '../../../userProtocol/userProtocol',
      })
  },
  go_mine(){
    wx.navigateTo({
      url: '../../../aboutMine/aboutMine',
    })
  }


})