var app = getApp();
Page({
  data: {
    details:{},
    skuList:{},
    isShow:false,
    platform: null,//手机版本
  },
  onLoad: function (options) {
    let skuId = options.text;
    var that = this;

    app.wxRequest('api/apiservice/sku/v1/getSkuColumnDetailInfo',
      { skuId: skuId }, 'POST', function (res) {
        let data = res.data.data;
        let arr = data.skuList;
        var labelArr = [];

        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }
        }

        that.setData({
          details: data,
          skuList: arr,
          isShow: false,
          platform: app.globalData.platform
        })

        wx.setNavigationBarTitle({
          title: data.title
        })

        if (app.globalData.platform != 'ios' && app.globalData.platform != 'devtools' ){
          if (options.webView == "1") {
            if (data.is_buy == "0") {
              let buyData = {
                skuName: data.title,
                skuInfo: data.info,
                priceStr: data.priceStr,
                price: data.price,
                skuId: data.skuId,
                skuType: data.skuType,
                tList: [
                  { tHeaderUrl: data.pic_url1 }
                ]
              };
              app.globalData.userBuyData = buyData;

              wx.redirectTo({
                url: '../home/pages/home_buy/home_buy',
              })
            }
          } else {
            if (data.is_buy == "0") {
              wx.redirectTo({
                url: '../webView/webView?url=https://api.licaishi365.com/app_page/staticHtml/newInsuranceCourseWeb/html/wxIndex.html'
              })
            } else {
              that.setData({
                details: data,
                skuList: arr,
                isShow: false,
              })
            }
          }
        }

       
        
        
    })

  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  banner: function (e) {
    let random = Math.random();
    let platform = this.data.platform
    console.log(platform)

    if (platform != 'ios' && platform != 'devtools'  ){
      wx.navigateTo({
        // url: '../home/pages/home_manuscript/home_manuscript',
        // url:'../home/pages/home_specialDetails/home_specialDetails'
        // url: '../home/pages/hoem_exam/hoem_exam'
        // url: '../home/pages/home_result/home_result'
        // url:'../home/pages/home_buy/home_buy'
        url: '../webView/webView?url=https://api.licaishi365.com/app_page/staticHtml/newInsuranceCourseWeb/html/wxIndex.html'
      })
    }else{
      wx.navigateTo({
        url: '../webView/webView?url=https://api.licaishi365.com/app_page/staticHtml/newInsuranceCourseWeb/html/IOSindex.html'
      })
    }
   

  },
  buy:function(e){
    let data = this.data.details;
    let buyData = {
      skuName: data.title,
      skuInfo: data.info,
      priceStr: data.priceStr,
      price: data.price,
      tList: [
        { tHeaderUrl: data.pic_url1 }
      ]
    };
    app.globalData.userBuyData = buyData;
    console.log(buyData);
    wx.redirectTo({
      url: '../home/pages/home_buy/home_buy',
    })
  },
  iosBuy:function(){
    app.showLoading("由于政策原因，请您到'我是理财师'APP内购买", "none");
  },
  // 课程跳转到详情
  to_details(e) {
    let dataType = e.currentTarget.dataset.type;
    let dataId = e.currentTarget.dataset.text;
    if (dataType == 0) {
      wx.navigateTo({
        url: '../home/pages/home_planDetails/home_planDetails?text=' + dataId,
      })
    }
    if (dataType == 1) {
      wx.navigateTo({
        url: '../home/pages/home_specialDetails/home_specialDetails?text=' + dataId,
      })
    }
    if (dataType == 2) {
      wx.navigateTo({
        url: '../home/pages/home_columnDetails/home_columnDetails?text=' + dataId,
      })
    }
    if (dataType == 3) {
      console.log("网页")
    }
  },
})