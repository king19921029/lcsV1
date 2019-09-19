//app.js
App({
  globalData: {
    url:'https://api.licaishi365.com',
    url: 'https://api-dev.licaishi365.com',
    userInfo: null,
    mineUser: null,
    userId: "",
    sysUserInfo: null,
    userBuyData:{},
    phone: "400-0585-365",
    userPhone:null,
    cwTextDetail:null,
    avatarUrl:null,//头像
    platform:null,//手机系统
    token:"",
    pageInfoData: {
      types:2,
      params: 'APP首页'
    },
    header: { 
      "content-type": "application/x-www-form-urlencoded",
      "device-type": "xiaochengxu-maya",
      "version": "0"
    },
  },
  //封装的请求方法
  wxRequest: function (url, param, method, success, fail, complete, header) {

    if (url.indexOf('https') != 0) {
      url = this.globalData.url + '/' + url
    }
    param = param || {}
    method = method
    header = this.globalData.header
    // param.userId = this.globalData.userId

    wx.request({
      header: header,
      url: url,
      data: param,
      method: method,

      success: function (res) {

        typeof success == 'function' && success(res)
        // wx.hideLoading()
      }
      ,
      fail: function (res) {
        typeof fail == 'function' && fail(res)
      }
      ,
      complete: function (res) {
        // wx.hideLoading()
        typeof complete == 'function' && complete(res)
      }
    })
  },
  onLaunch: function () {
    var that = this;
    let token = wx.getStorageSync("token") || null;
    that.globalData.header["x-authorization"] = token;
    that.globalData.token = token
    that.globalData.header["uuid"] = wx.getStorageSync("uuid");
    //判断系统
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
      }
    })
    console.log("onLaunch");
    this.wxRequest('api/apiservice/sku/v1/indexSubjectList',
      {}, 'POST', function (res) {
        var homeData = res.data.data
        homeData.forEach((label) => {
          var arr = label.skuList;
          var labelArr = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].label) {
              var str = arr[i].label.split(",");
              arr[i].label = str;
            }

          }
        })
        wx.setStorage({
          key: "homeData",
          data: homeData
        })
    })
    that.getOpenId();
  },
  getOpenId:function(){
    var that = this;
    // 登录获取code发送给后台拿到optionId
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          var code = res.code;
          that.wxRequest('api/apiservice/user/v1/wechatopenid',
            { jscode: code }, 'POST', function (res) {

              wx.setStorageSync("code", code)
              wx.setStorageSync("uuid", res.data.data)
              console.log()
              
              that.globalData.header["uuid"] = wx.getStorageSync("uuid");
              
              that.wxRequest('api/apiservice/wechat/v1/weiXinAauth4XCXOpenId', { code: code }, 'get', function (res) {
                console.log(res);
                that.globalData.openId = res.data.openid;
                wx.setStorageSync("openId", res.data.openid)
                that.globalData.unionId = res.data.unionid;
              })

              // that.wxRequest('api/apiservice/wechat/v1/weiXinAauth4UnionId', { code: code }, 'get', function (res) {
              //   console.log(res);
              // })

              // 心跳检测
              // var livesignalInterval = setInterval(function () {
              //   var timestamp = Date.parse(new Date());
              //   timestamp = timestamp / 1000;

              //   if (timestamp % 60 == 0) {
              //     that.wxRequest('api/apiservice/statistics/v1/livesignal', {}, 'POST', function (res) {
              //       // console.log(res.data)
              //       console.log("用时1分钟在线人数****人");
              //     })
              //   }
              // }, 1000)
            })


          // var appid = "wxe56a10a18a1a932b";
          // var secret = "ba70ed12d8f6a60e641a9946146225f3"
          // var wxUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'; 

          // wx.request({
          //   url: wxUrl,
          //   data: {},
          //   method: 'GET', 
          //   success: function (res) {
          //     console.log(res.data.openid);
          //     var openid = res.data.openid;

          //     // 获取access_token
          //     var tokens = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + secret
          //     wx.request({
          //       url: tokens,
          //       data: {},
          //       method: 'GET',
          //       success: function (res) {
          //         var access_token = res.data.access_token;
          //         console.log(access_token)
          //         console.log(openid)
          //         // 获取unionid
          //         var un = "https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&access_token=" + access_token + "&openid=" + openid
          //         wx.request({
          //           url: un,
          //           data: {

          //           },
          //           method: 'GET',
          //           success: function (res) {
          //             console.log(res);
          //           }
          //         });
          //       }
          //     });
          //   }
          // });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        // wx.getUserInfo({
        //   success: function (res) {
        //   that.globalData.avatarUrl = res.userInfo.avatarUrl
        //   }
        // })


      },
    })
  },
  learntime(types){
    this.globalData.header["uuid"] = wx.getStorageSync("uuid");
    this.wxRequest('api/apiservice/statistics/v1/learntime', 
      { types: types}, 'POST', function (res) {
    })
  },
  onPullDownRefresh: function () {
    //在标题栏中显示加载
    wx.showNavigationBarLoading() 
  },
  //打开loading
  showLoading: function (title,types) {
    wx.showToast({
      title: title,
      icon: types
    });
  },
  //取消loading
  cancelLoading: function () {
    wx.hideToast();
  },
  //用户进入页面触发
  userSeePage: function (params, pageName) {
    var that = this;
    // that.wxRequest('api/apiservice/statistics/v1/pageview',
    //   { params: params, pageName: pageName}, 'POST', function (res) {
    // })
  },
  // 用户页面停留时间接口
  userSeePageTime(params, pageName, comeDate, leaveDate) {
    this.wxRequest('api/apiservice/statistics/v1/pageviewtime',
      { params: params, pageName: pageName, comeDate: comeDate, leaveDate: leaveDate }, 'POST', function (res) {
      })
  },
  // getSysUserInfo() {
  //   let that = this
  //   // 登录
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         let code = res.code
  //         // console.log(code)
  //         // 授权
  //         wx.getSetting({
  //           success(res) {
  //             if (!res['scope.userInfo']) {
  //               // 同意授权
  //               // wx.authorize({
  //               //   scope: 'scope.userInfo',
  //               //   success() {
  //               //     that.offlineLogin(code)
  //               //   }
  //               // })
  //               console.log(res)
  //               console.log(code);
  //             } else {
  //               // that.offlineLogin(code)
  //               console.log(res)
  //             }
  //           }
  //         })
  //       } else {
  //         console.log('获取用户登录态失败！' + res.errMsg)
  //       }

  //     }

  //   });
  // },

})