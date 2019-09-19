var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    yeBtn:true,//余额按钮
    shop_pic:299,//价格
    money:"",//余额
    cuntMoney:"",//计算价格
    buy:true,//确认支付
    recharge:false,//充值中心
    weChatPayINfo:{},//充值必备参数
    userId:null,
    isShow:false,
    shopData:{},//商品
    headerImg:"",
    pageInfoData: {
      comeDate: "",
      page_code: '1',
      page_info: '购买页'
    }

  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    var that = this;
    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = 'APP首页';

    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '1',
        page_info: '购买页'
      }
    })

    // 用户打开页面
    app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);
   
    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
      let data = res.data.data
      console.log(data);
      if( res.data.code != 0 ){
        app.showLoading("请先登录", "none");
        var timer = setTimeout(function () {
          wx.redirectTo({
            url: '../../../passwordLogin/passwordLogin'
          })
        }, 500)
      }else{
        that.setData({
          money: data.androidAccountBalance,
          cuntMoney: data.androidBalance,
          shopData: app.globalData.userBuyData,
          shop_price: parseInt(app.globalData.userBuyData.price),
          isShow:true
        })
        // console.log(typeof data.androidBalance)
        // console.log(parseInt(app.globalData.userBuyData.price))
      }

    })
     

  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;

    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;
    app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);
  },
  //余额按钮
  yebTap: function () {
    let that = this;
    let shopData = that.data.shopData;
    // 购买商品接口（余额足够时）
    app.wxRequest('api/apiservice/sku/v1/buySkuObject', {
        skuId: shopData.skuId,
        skuType: shopData.skuType,
        balancePrice: shopData.price,
        balanceType: '1'
      },
      'POST', function (res) {
        console.log(res);
        if( res.data.code == 0 ){
          app.showLoading("购买成功", "success");
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        }else{
          app.showLoading(res.data.msg, "none");
        }
        
    })

  },
  // 去充值
  go_recharge:function(){
    wx.navigateTo({
      url: "../../../mine/pages/mine_myAccount/mine_myAccount"
    })
  },
  // 支付
  buyShop:function(){ 
  
    let openId = wx.getStorageSync("openId");
    // 支付接口余额不足时走微信充值
    app.wxRequest('api/apiservice/pay/v1/charge4wechatjsapiofxcx', 
      { skuId: "eae5c534866a4983bcd72e0ca6604b90", skuType: 1, chargeId: "2", openid: openId, buyType:0}, 
      'POST', function (res) {
      
      let weChatPayINfo = res.data.data.weChatPayINfo
      wx.requestPayment({
        'timeStamp': weChatPayINfo.timestamp,
        'nonceStr': weChatPayINfo.noncestr,
        'package': weChatPayINfo.perpayid,
        'signType': 'MD5',
        'paySign': weChatPayINfo.sign,
        'success': function (res) {
          console.log(res);
          app.showLoading("购买成功")
          wx.navigateBack();
        },
        'fail': function (res) {
          console.log(res);
        }
      })
    })
  }
})