var app = getApp();
Page({

  data: {
    nickName:"",//用户名
    avatarUrl:"",//头像
    getUserCertificate:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
   
    app.wxRequest('getUserCertificate', {}, 'POST', function (res) {
      console.log(res.data.data)
      that.setData({
        getUserCertificate: res.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
})