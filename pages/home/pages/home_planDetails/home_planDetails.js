var app = getApp();
var WxParse = require('../../../util/wxParse/wxParse.js');
const util = require('../../../util/util.js');
Page({
  data: {
    isMicPlay: false,//音频迷你播放
    home_isShow: true,//主页面是否显示
    words_isShow: true,//播放页是否显示
    isScroll: true,//滚动条是否滚动
    words_animation:{},
    detailsData:{},
    skuStudyPlanCWList: {},//课程列表
    classNum:"",//课程数量
    skuStudyPlanCommentList:{},//评论数据
    skuStudyPlanOtherLis:{},//适宜人群等
    user_say:"",//用户留言
    firstData:{},//试听列表第一条数据
    platform:null,//手机系统
    noLoginPlanCWList:{},
    token:null,
    text:"",
    pageInfoData: {
      comeDate: "",
      page_code: '2',
      page_info: 'SKU详情页',
    },
    isTestCwid:false,
    detailsCwid:null,//记录正在播放id
  },
  onLoad: function (option) {
    this.setData({
      text: option.text,
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
      words_isShow: false,
      token: app.globalData.token
    })
   
  },
  onShow: function () {
    var that = this;   
    let text = that.data.text;

    if (app.globalData.isMicPlay) {
      this.setData({
        isMicPlay: true
      })
    } else {
      this.setData({
        isMicPlay: false
      })
    }

    // 全局赋值本页面参数  // 用户打开页面
    // app.globalData.pageInfoData.types = 2;
    // app.globalData.pageInfoData.params = 'SKU详情页';
    // let pageInfoData = that.data.pageInfoData;
    // var comeDate = Date.parse(new Date());
    // comeDate = comeDate / 1000;
    // app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);
    // that.setData({
    //   pageInfoData: {
    //     comeDate: comeDate,
    //     page_code: '2',
    //     page_info: 'SKU详情页',
    //   },
    // })

    

    //正式学习计划详情页接口
    app.wxRequest('api/apiservice/sku/v1/skuStudyPlanDetailInfo', 
      { skuId: text}, 'POST', function (res) {
        let detailsData = res.data.data;
        // console.log(detailsData)
        if (res.data.data.testCwId) {
          that.setData({
            detailsData: detailsData
          })
        } else {
          that.setData({
            detailsData: detailsData,
            isTestCwid: 1
          })
        }
      
      wx.setNavigationBarTitle({
        title: detailsData.skuName//页面标题为路由参数
      })
    })

    // 正式学习计划额外信息接口
    app.wxRequest('api/apiservice/sku/v1/skuStudyPlanOtherList',
      { skuId: text}, 'POST', function (res) {
        var article = res.data.data;
        // console.log(article);
        if (article){
          WxParse.wxParse('article', 'html', article, that, 5);
        }else{
          return false;
        }
        
    })

    // 正式学习计划课件接口
    app.wxRequest('api/apiservice/sku/v1/skuStudyPlanCWList',
      { skuId: text }, 'POST', function (res) {
        // console.log(res.data)
        if(res.data.code == 0){
          let classNum = res.data.data;
          let arr = [];
          for (var i = 0; i < classNum.length;i++){
            if (classNum[i].cwType == 0 )
              arr.push(classNum[i].cwType)
          }
          that.setData({
            skuStudyPlanCWList: res.data.data,
            classNum: arr.length,
          })
          
          // if (app.globalData.token == null) {
          //     let oldArr = res.data.data;
          //     let newARR = oldArr.splice(0, 1);
          //     that.setData({
          //       noLoginPlanCWList: oldArr,
          //       firstData: newARR[0]
          //     })
          //   } else {
          //     let classNum = res.data.data;
          //     let arr = [];
          //     for (var i = 0; i < classNum.length;i++){
          //       if (classNum[i].cwType == 0 )
          //         arr.push(classNum[i].cwType)
          //     }
          //     that.setData({
          //       skuStudyPlanCWList: res.data.data,
          //       classNum: arr.length,
          //     })

          // }
        }  
    })

    // 正式用户评论接口
    app.wxRequest('api/apiservice/sku/v1/skuStudyPlanCommentList',
      { skuId: text }, 'POST', function (res) {
        
        that.setData({
          skuStudyPlanCommentList: res.data.data
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
  ios_go_buy: function () {
    app.showLoading("由于政策原因，请您到'我是理财师'APP内购买", "none");
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
          url: '../../../home_manuscript/home_manuscript?cwId=' 
          + cwId
          + "&skuId=" 
          + skuId + "&skuType=0"
        })
      } else if (status == 1 && cwType == 1) {
        // 去考试
        if (progress == "未考试"){
          wx.redirectTo({
            url: '../hoem_exam/hoem_exam?cwId='
              + cwId + '&text='
              + this.data.text
              + "&skuId="
              + skuId + "&skuType=0"
          })
        }else{
          wx.redirectTo({
            url: '../home_result/home_result?qpId='
            + qpId 
            + "&isRes=true"
            + "&cwId=" + cwId
            + "&skuId=" + skuId 
              + "&skuType=0" + '&text='
              + this.data.text
          }) 
        }
        
      }else{
        app.showLoading("课程未解锁", "none");
      }
    }else {
      if (status == 1){
        wx.navigateTo({
          url: '../../../home_manuscript/home_manuscript?cwId='
            + cwId + '&text='
            + this.data.text
            + "&skuId="
            + skuId + "&skuType=0"
        })
      }else{
        app.showLoading("请先登录", "none");
        var timer = setTimeout(function () {
          wx.redirectTo({
            url: '../../../passwordLogin/passwordLogin'
          })

        }, 500)
      }
      
    }

  },
  // 试听
  testListen:function(e){
    var that = this;
    let skuId = that.data.detailsData.skuId;
    let cwId = that.data.detailsData.testCwId;
    console.log(cwId)
    if (cwId) {
      wx.navigateTo({
        url: '../../../home_manuscript/home_manuscript?cwId='
          + cwId
          + "&skuId="
          + skuId + "&skuType=0"
      })
    }else{
      that.setData({
        isTestCwid: !that.data.isTestCwid
      })
    }

    // for (var i = 0; i < listenList.length; i++) {
    //   if (listenList[i].cwClockStatus == 1) {
    //     wx.navigateTo({
    //       url: '../../../home_manuscript/home_manuscript?cwId='
    //         + listenList[i].cwId + "&skuId=" + listenList[i].skuId + "&skuType=0"
    //     })
    //     return false;
    //   } else {
    //     app.showLoading("请先登录", "none");
    //     var timer = setTimeout(function () {
    //       wx.redirectTo({
    //         url: '../../../passwordLogin/passwordLogin'
    //       })
    //     }, 500)
    //   }
    // }

    

    
  
  },
  // 去购买页面
  go_buy: function () {
    let token = wx.getStorageSync("token");
    if (token == "") {
      app.showLoading("请先登录", "none");
      var timer = setTimeout(function () {
        wx.redirectTo({
          url: '../../../passwordLogin/passwordLogin'
        })
      }, 500)
    } else {
      app.globalData.userBuyData = this.data.detailsData
      wx.navigateTo({
        url: '../home_buy/home_buy',
      })
    }
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

        var shopData = that.data.detailsData;
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
  lessTap: util.repeatFun(function (e) {

    this.setData({
      words_isShow: true,
      home_isShow:false
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

  }, 300),
  // 去老师列表
  go_teacherDetails:function(){
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
  userSay:function(e){
    var that = this;
    let user_say = e.detail.value;
    that.setData({
      user_say: e.detail.value
     }) 
    
  },
  // 发送评论
  sendUserComment:function(){
    var that = this;
    let user_say = that.data.user_say;
    let skuId = that.data.skuId;
    
    if (user_say == "" || user_say == null){
      app.showLoading("请输入留言", "none")
    }else{
      app.wxRequest('api/apiservice/sku/v1/sendUserComment', { skuId: skuId, skuType: "0", comment: user_say }, 'POST', function (res) {
        console.log(res.data)
        app.showLoading("留言成功", "none")
        that.sselTap();
      })
    }
   
    
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