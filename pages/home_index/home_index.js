
var app = getApp();
Page({

  data: {
    webView_isShow:false,
    banner:{},//banner
    notice:{},//通知
    homeData:{},//自定义板块
    homeTitle: {},//自定义板块头部
    homeClass:{},//分类
    indexCategoryList:{},//banner下的分类
    isMicPlay:false,//音频迷你播放
    platform:null,//手机版本
    isNext:true,
    pageInfoData:{
      comeDate: "",
      page_code:'1',
      page_info:'APP首页'
    }
  },
  onLoad: function (options) {
    console.log("onLoad")
    var that = this;
    app.wxRequest('api/apiservice/sku/v1/indexBannerList',
      {}, 'POST', function (res) {
        let banner = res.data.data;
        app.wxRequest('api/apiservice/sku/v1/indexCategoryList',
          {}, 'POST', function (res) {
            if (!banner) {
              app.showLoading("加载中", 'loading')
            }
            let homeClass = res.data.data;
            that.setData({
              homeClass: homeClass,
              banner: banner
            })
        })

    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
      }
    })
    
    // Math.random().toString(36).substr(2, 15)
    // var exams = wx.getStorageSync("exam");
    // var arr = [];
    // for (var k in exams) {
    //   let opt = exams[k].qlistArr;
    //   let str = opt.join("");
    //   arr.push(str)
    // }
    // console.log(arr.join(","));

    wx.getStorage({
      key: 'homeData',
      success: function (res) {
        that.setData({
          homeData: res.data
        })
      },
      fail: function (res) {
        that.setData({
          dialog: false
        })
      }
    })
   
  },
  onShow: function () {
    console.log("onShow")
    wx.removeStorageSync('gradeAjaxData');
    wx.removeStorageSync('labelAjaxData');
    wx.removeStorageSync('professionAjaxData');
    wx.removeStorageSync('sortAjaxData');
    wx.removeStorageSync('grade_label');


    if (app.globalData.isMicPlay ){
      console.log("正在播放");
      this.setData({
        isMicPlay:true,
        platform: app.globalData.platform
      })
    }else{
      this.setData({
        isMicPlay: false,
        platform: app.globalData.platform
      })
    }
    wx.setNavigationBarTitle({
      title: "发现"
    })

    var that = this;
    let token = wx.getStorageSync("token") || null;
    app.globalData.header["x-authorization"] = token;
    app.globalData.token = token

   
    // 正式 学习计划banner接口
    // app.wxRequest('api/apiservice/sku/v1/indexBannerList',
    //   {}, 'POST', function (res) {
        
    //     that.setData({
    //       banner: res.data.data
    //     })
    // })
    // home页分类接口
    // app.wxRequest('api/apiservice/sku/v1/indexCategoryList',
    //   {}, 'POST', function (res) {
    //     // console.log(res.data.data)
    //     that.setData({
    //       homeClass: res.data.data
    //     })
    // })
    // 正式 学习计划通知接口
    app.wxRequest('api/apiservice/sku/v1/indexNewsList',
      {}, 'POST', function (res) {
        var say = res.data.data;
        that.setData({
          notice: say
        })
    })

    // 正式 学习计划首页包装接口
    app.wxRequest('api/apiservice/sku/v1/indexSubjectList',
      {}, 'POST', function (res) {
        var homeData = res.data.data
        homeData.forEach((label) => {
          var arr = label.skuList;
          var labelArr = [];
          for (var i = 0; i < arr.length; i++) {

            if (arr[i].label) {
              var str = arr[i].label.split(",");

              arr[i].label = str;
              // console.log(arr[i])
            }

          }
        })
        that.setData({
          homeData: homeData
        })
    })


    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = 'APP首页';

    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;
    
    // that.setData({
    //   pageInfoData:{
    //     comeDate: comeDate,
    //     page_code: '1',
    //     page_info: 'APP首页'
    //   }
    // })

    // 用户打开页面
    // app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);

  },
  onReady:function(){
    console.log("onReady")
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  banner: function (e) {
    console.log(e.currentTarget.dataset.text);
    wx.navigateTo({
      // url: '../home/pages/home_manuscript/home_manuscript',
      // url:'../home/pages/home_specialDetails/home_specialDetails'
      // url: '../home/pages/hoem_exam/hoem_exam'
      // url: '../home/pages/home_result/home_result'
      // url:'../home/pages/home_buy/home_buy'
      url: '../webView/webView?url=' + e.currentTarget.dataset.text
    })
  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;
  
    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;
    // app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info,pageInfoData.comeDate,leaveDate);
  },
  scroll_tab:function(){
  },
  // 分类按钮
  classify_tap:function(e){
    let professionAjaxData = e.currentTarget.dataset.id;
    let dataType = e.currentTarget.dataset.type;
    
    if (dataType == 1){
      wx.navigateTo({
        url: "../home_classify/home_classify"
      })
    }else{
      wx.navigateTo({
        url: "../home_allClassify/home_allClassify?professionAjaxData=" + professionAjaxData
      })
    }
  },
  //去学习计划详情页面
  go_planDetails: function () {
    wx.navigateTo({
      //学习计划详情页
      url: '../home/pages/home_planDetails/home_planDetails'
    })

  },
  //去专题课详情页面
  go_specialDetails: function () {
    wx.navigateTo({
      url: '../home/pages/home_specialDetails/home_specialDetails'
    })

  },
  //去订阅专栏详情页面
  go_columnDetails: function () {
    wx.navigateTo({
      url: '../home/pages/home_columnDetails/home_columnDetails'
    })

  },
  // 通用全部
  go_com_allclass:function(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../home/pages/home_allPlan/home_allPlan?id=' + id + "&title=" + title
    })
  },
  //去全部计划
  go_allPlan:function(){
    wx.navigateTo({
      url: '../home/pages/home_allPlan/home_allPlan'
    })
  },
  // 去全部专题
  go_allSpecial:function(){
    wx.navigateTo({
      url: '../home/pages/home_allSpecial/home_allSpecial'
    })
  },
  // 去全部专栏
  go_allColumn: function () {
    wx.navigateTo({
      url: '../home/pages/home_allColumn/home_allColumn'
    })
  },
  // 通用跳转函数
  com_tap: function (e) {
   
    let dataType = e.currentTarget.dataset.type;
    let dataId = e.currentTarget.dataset.text;
    let token = wx.getStorageSync("token");
    if (token == "" && token == null ){
      app.globalData.header["x-authorization"] = token;
      app.globalData.token = token
    }
    
    if (dataType == 0) {
      wx.navigateTo({
        url: '../home/pages/home_planDetails/home_planDetails?text='+dataId,
      })
    }
    if (dataType == 1) {
      if (dataId == "f9ee93be45774ebbacccb824237e25f4" || dataId == "b78ebdbd9bbf4537a77a164f6f8cb221"  ){
        app.showLoading("敬请期待",'none');
      }else{
        wx.navigateTo({
          url: '../home/pages/home_specialDetails/home_specialDetails?text=' + dataId,
        })
      }
      
    }
    if (dataType == 2) {
      wx.navigateTo({
        url: '../home_columnDetails/home_columnDetails?text=' + dataId,
      })
    }
    if (dataType == 3) {
      wx.navigateTo({
        url: '../webView/webView?url=' + e.currentTarget.dataset.text
      })
    }
  },
  // 播放浮窗
  mic_iconTap:function(){
    let cwId = wx.getStorageSync("cwId");
    let skuId = wx.getStorageSync("skuId");
    let skuType = wx.getStorageSync("skuType");

    wx.navigateTo({
      url: '../home_manuscript/home_manuscript?cwId='
        + cwId + '&text='
        + this.data.text
        + "&skuId="
        + skuId + "&skuType=" + skuType
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
  
  
})