var app = getApp();
Page({

  data: {
    pageInfoData: {
      comeDate: "",
      page_code: '13',
      page_info: '个人中心首页',
    },
    isMicPlay: false,//音频迷你播放
    platform: null,//手机系统
    phone: "",
    user:{},
    province:[],
    token:"",
    avatarUrl:null,
  },

  onLoad: function () {
    
  },
  onPullDownRefresh: function () {
    console.log(1);
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  onShow: function () {
    var that = this;
    
    // 用户进入页面时间
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = '个人中心首页';

    wx.setNavigationBarTitle({
      title: "我的"
    })
    if (app.globalData.isMicPlay) {
      console.log("正在播放");
      this.setData({
        isMicPlay: true,
        platform: app.globalData.platform
      })
    } else {
      this.setData({
        isMicPlay: false,
        platform: app.globalData.platform
      })
    }

    
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      phone: app.globalData.phone,
      token: app.globalData.token,
      pageInfoData: {
        comeDate: comeDate,
        page_code: '13',
        page_info: '个人中心首页',
      },
     
    })
    // 用户打开页面
    // app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);

    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
    
      let initUser = res.data.data;
      if (res.data.code == 0 ){
        
        app.globalData.userPhone = res.data.data.phone;
        that.setData({
          user: initUser,
          userImg: initUser.headerUrl,
          avatarUrl: res.data.data.headerUrl
        })
      }else{
        wx.removeStorageSync('token');
        app.globalData.token = null;

        that.setData({
          user: initUser,
          token:null
        })
      }
    
    })
  },
  onHide: function () {

  },
  // 去修改资料
  go_revise:function () {
    var that = this;
    let token = wx.getStorageSync("token");
    console.log(token)
    if (token != "" && token != null) {
      wx.navigateTo({
        url: '../mine/pages/mine_revise/mine_revise'
      })
      
    }else{
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
      var timer = setTimeout(function () {
        wx.navigateTo({
          url: '../passwordLogin/passwordLogin'
        })

      }, 500)
    }
  },
  // 去已购课程
  go_buyCourse: function () {
  
    var that = this;
    let token = wx.getStorageSync("token");
    if (!token) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
      var timer = setTimeout(function () {
        wx.navigateTo({
          url: '../passwordLogin/passwordLogin'
        })

      }, 500)
    } else {
      wx.navigateTo({
        url: '../mine/pages/mine_buyCourse/mine_buyCourse'
      })
    }
  },
  // 分享给好友
  onShareAppMessage: function () {
    return {
      title: '我是理财师，让理财师更专业',
      desc: '通过我是理财师的APP学习成为一名游戏的理财师',
      path: 'https://api.licaishi365.com/app_page/download/html/download.html',
    }
  },
  // 分享
  onShare:function(){
    this.onShareAppMessage();
  },
  // 去我的账户
  go_myAccount: function () {

    var that = this;
    let token = wx.getStorageSync("token");
    if (!token) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
      var timer = setTimeout(function () {
        wx.navigateTo({
          url: '../passwordLogin/passwordLogin'
        })

      }, 500)
    } else {
      wx.navigateTo({
        url: '../mine/pages/mine_myAccount/mine_myAccount'
      })
    }
  },
  // 去设置
  go_setUp: function () {
    var that = this;
    let token = wx.getStorageSync("token");
    console.log(token)
    if (token != "" && token != null) {
       wx.navigateTo({
        url: '../mine/pages/mine_setUp/mine_setUp'
      })
      
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
      var timer = setTimeout(function () {
        wx.navigateTo({
          url: '../passwordLogin/passwordLogin'
        })

      }, 500)
    }
    
    
  },
  // 拨打电话
  phoneTap(e) {
    wx.makePhoneCall({
      phoneNumber: "4000585365"
    })
  },
  // 播放浮窗
  mic_iconTap: function () {
    let cwId = wx.getStorageSync("cwId");
    let skuId = wx.getStorageSync("skuId");
    let skuType = wx.getStorageSync("skuType");

    wx.navigateTo({
      url: '../home_manuscript/home_manuscript?cwId='
        + cwId + '&linkText='
        + this.data.linkText
        + "&skuId="
        + skuId + "&skuType=" + skuType
    })
  },

})