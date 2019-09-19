var app = getApp();
var WxParse = require('../../../util/wxParse/wxParse.js');
Page({
  data: {
    isMicPlay: false,//音频迷你播放
    home_isShow: true,//主页面是否显示
    words_isShow: true,//播放页是否显示
    isScroll: true,//滚动条是否滚动
    words_animation: {},
    skuSubjectDetailInfo:{},//专题详情
    skuSubjectCWList:{},//专题课程
    classNum: "", //课程数量
    skuSubjectOtherList: "",//学习专题额外信息获取接口
    skuSubjectCommentList: "", //学习专题评论信息获取接口
    num:50,
    user_say: "",//用户留言
    firstData: {},//试听列表第一条数据
    platform:null,//手机系统
    noLoginPlanCWList: {},
    token:null,
    text:"",
    isTestCwid:0,
    pageInfoData: {
      comeDate: "",
      page_code: '2',
      page_info: 'SKU详情页',
    },
  },
  onLoad: function (options) {
    var that = this;

    that.setData({
      text: options.text,
      token:app.globalData.token,
      platform: app.globalData.platform
    })
  
 
   var animation = wx.createAnimation({
     duration: 1000,
     timingFunction: 'ease',
     transformOrigin: "50% 50%",
   })
   this.animation = animation;
   animation.translateY(603).step();

   this.setData({
     words_animation: animation.export(),
     words_isShow: false
   })
    
  },
  onShow: function () {
    var that = this;
    let text = that.data.text;
    let userId = that.data.userId;

    if (app.globalData.isMicPlay) {
      console.log("正在播放");
      this.setData({
        isMicPlay: true
      })
    } else {
      this.setData({
        isMicPlay: false
      })
    }

    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = 'SKU详情页';

    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate
      }
    })

    // 用户打开页面
    app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);
    
    //专题课详情页接口
    app.wxRequest('api/apiservice/sku/v1/skuSubjectDetailInfo',
      { skuId: text, userId: "1" }, 'POST', function (res) {
        
        if (res.data.data.testCwId){
          that.setData({
            skuSubjectDetailInfo: res.data.data
          })
        }else{
          that.setData({
            skuSubjectDetailInfo: res.data.data,
            isTestCwid:1
          })
        }
    
        wx.setNavigationBarTitle({
          title: res.data.data.skuName
        })
        
    })

    // 专题课额外信息接口
    app.wxRequest('api/apiservice/sku/v1/skuSubjectOtherList',
      { skuId: text, userId: "1" }, 'POST', function (res) {
      
        var article = res.data.data;
     
        if (article) {
          WxParse.wxParse('article', 'html', article, that, 5);
        } else {
          return false;
        }
    })
    // 课程接口
    app.wxRequest('api/apiservice/sku/v1/skuSubjectCWList',
      { skuId: text }, 'POST', function (res) {
        if (that.data.token == '') {
          let oldArr = res.data.data;
          let newARR = oldArr.splice(0, 1);
          that.setData({
            noLoginPlanCWList: oldArr,
            firstData: newARR[0]
          })
        }else{
          let classNum = res.data.data;
          let arr = [];
          for (var i = 0; i < classNum.length; i++) {
            if (classNum[i].cwType == 0)
              arr.push(classNum[i].cwType)
          }
          that.setData({
            skuSubjectCWList: res.data.data,
            classNum:arr.length
          })
        }
        
    })

    // 正式用户评论接口
    app.wxRequest('api/apiservice/sku/v1/skuSubjectCommentList',
      { skuId: text, userId: "1" }, 'POST', function (res) {
        // console.log(res.data.data);
        that.setData({
          skuSubjectCommentList: res.data.data
        })
    })
    
  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;

    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;
    app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);

  },
  //去文稿页
  go_manucript: function (e) {

    var that = this;
    let token = that.data.token;
    let status = e.currentTarget.dataset.status;
    let cwType = e.currentTarget.dataset.cwtype
    let cwId = e.currentTarget.dataset.id;
    let skuId = e.currentTarget.dataset.skuid;

    let progress = e.currentTarget.dataset.progress;//分数
    let qpId = e.currentTarget.dataset.qpid;//qpid

    if (token != null && token != "") {

      if (status == 1 && cwType == 0) {
        wx.navigateTo({
          url: '../../../home_manuscript/home_manuscript?cwId=' + cwId + '&text=' + this.data.text + "&skuId=" + skuId + "&skuType=1"
        })


      } else if (status == 1 && cwType == 1) {

        // 去考试
        if (progress == "未考试") {
          wx.navigateTo({
            url: '../hoem_exam/hoem_exam?cwId='
              + cwId + '&text='
              + this.data.text
              + "&skuId="
              + skuId + "&skuType=1"
          })
        } else {
          wx.navigateTo({
            url: '../home_result/home_result?qpId='
              + qpId
              + "&isRes=true"
              + "&cwId=" + cwId
              + "&skuId=" + skuId
              + "&skuType=1" + '&text='
              + this.data.text
          }) 
        }

      } else {
        app.showLoading("课程未解锁", "none");
      }
    } else if (status == 1) {
      wx.navigateTo({
        url: '../../../home_manuscript/home_manuscript?cwId=' + cwId + '&text=' + this.data.text + "&skuId=" + skuId + "&skuType=0"
      })
    } else {
      app.showLoading("请先登录", "none");
      var timer = setTimeout(function () {
        wx.redirectTo({
          url: '../../../passwordLogin/passwordLogin'
        })

      }, 500)
    }

  },
  // 试听
  testListen: function (e) {
    var that = this;
    let skuId = that.data.skuSubjectDetailInfo.skuId;
    let cwId = that.data.skuSubjectDetailInfo.testCwId;

    if (cwId) {
      wx.navigateTo({
        url: '../../../home_manuscript/home_manuscript?cwId='
          + cwId
          + "&skuId="
          + skuId + "&skuType=1"
      })
    }



  },
  // 未登录时去文稿页
  test_go_manuscript: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../home_manuscript/home_manuscript?id=' + id,
    })
  },
  // 去购买页面
  go_buy: function () {
    let token = wx.getStorageSync("token");
    if(token == ""){
      app.showLoading("请先登录", "none");
      var timer = setTimeout(function () {
        wx.redirectTo({
          url: '../../../passwordLogin/passwordLogin'
        })
      }, 500)
    }else{
      app.globalData.userBuyData = this.data.skuSubjectDetailInfo
      wx.navigateTo({
        url: '../home_buy/home_buy',
      })
    }
  },
  ios_go_buy:function(){
    app.showLoading("由于政策原因，请您到'我是理财师'APP内购买", "none");
  },
  // 免费订阅
  no_buy: function () {
    var that = this;
    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
      let data = res.data.data
      console.log(data);
      if (res.data.code != 0) {
        app.showLoading("请先登录", "none");
        var timer = setTimeout(function () {
          wx.redirectTo({
            url: '../../../passwordLogin/passwordLogin'
          })
        }, 500)
      } else {

        var shopData = that.data.skuSubjectDetailInfo
        console.log(shopData)
        // 购买商品接口（余额足够时）
        app.wxRequest('api/apiservice/sku/v1/buySkuObject', {
          skuId: shopData.skuId,
          skuType: shopData.skuType,
          balancePrice: shopData.price,
          balanceType: '1'
        },
          'POST', function (res) {
            console.log(res);
            app.showLoading("购买成功", "success");
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          })

      }

    })

  },
  //去习题页面
  go_exam: function () {
    wx.navigateTo({
      url: '../hoem_exam/hoem_exam',
    })
  },
  // 去老师列表
  go_teacherDetails: function () {
    wx.navigateTo({
      url: '../home_teacherDetails/home_teacherDetails',
    })
  },
  // 转发
  onShareAppMessage: function () {
    return {
      title: '学习计划',
      desc: '有深度有内涵的金融',
    }
  },
  // 评论
  userSay: function (e) {
    var that = this;
    let user_say = e.detail.value;
    that.setData({
      user_say: e.detail.value
    })

  },
  // 发送评论
  sendUserComment: function () {
    var that = this;
    let user_say = that.data.user_say;
    console.log(user_say);
    app.wxRequest('api/apiservice/sku/v1/sendUserComment', { skuId: "1", skuType: "0", comment: user_say }, 'POST', function (res) {
      console.log(res.data)
      this.sselTap();
    })

  },
  // 下去
  sselTap: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
    })
    this.animation = animation;
    animation.translateY(603).step({ duration: 900 });
    this.setData({
      words_animation: animation.export()
    })
    setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        transformOrigin: "50% 50%",
      })
      this.animation = animation;
      animation.opacity(1).step();
      this.setData({
        home_animation: animation.export(),
        home_isShow: true,
        words_isShow: false,
      })

    }.bind(this), 300)
  },
  // 上来
  lessTap: function () {

    this.setData({
      words_isShow: true,
      home_isShow: false,
    })

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
    })
    this.animation = animation;

    animation.top(0).step({ duration: 1000 })
    this.setData({
      words_animation: animation.export()
    })

  },
  // 免费购买
  free_buy:function(){
  },
  // 发送评论
  sendUserComment: function () {
    var that = this;
    let user_say = that.data.user_say;
    let skuId = that.data.skuId;
    console.log(user_say);
    app.wxRequest('api/apiservice/sku/v1/sendUserComment', { skuId: skuId, skuType: "1", comment: user_say }, 'POST', function (res) {
      console.log(res.data)
      app.showLoading("留言成功", "none")
      that.sselTap();
    })

  },
  // 播放浮窗
  mic_iconTap: function () {
    let cwId = wx.getStorageSync("cwId");
    let skuId = wx.getStorageSync("skuId");
    let skuType = wx.getStorageSync("skuType");

    wx.navigateTo({
      url: '../../../home_manuscript/home_manuscript?cwId='
        + cwId + '&text='
        + this.data.text
        + "&skuId="
        + skuId + "&skuType=" + skuType
    })
  },
  
})