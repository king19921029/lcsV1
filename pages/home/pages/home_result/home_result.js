var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userQuestionResult:{},
    fraction:""
  },
  onLoad: function (options) {
    app.showLoading("加载中","loading")
    var that = this;
    var exams = wx.getStorageSync("exam");

    let cwId = options.cwId;
    let skuId = options.skuId;
    let skuType = options.skuType;
    let text = options.text;


    console.log(options)

    let qpId = options.qpId;
    let isRes = options.isRes;
    
    // 如果已经考过了
    if (isRes){
      app.wxRequest('api/apiservice/sku/v1/userQuestionResult',
        { qpId: qpId, type: "1", size: "", skip:""}, 'POST', function (res) {
  
          that.setData({
            userQuestionResult: res.data.data,
            fraction: parseInt(res.data.data.qpPoint),
            cwId: cwId,
            skuId: skuId,
            skuType: skuType,
            text: text,
          })

        })
    }else{
      var arr = [];
      for (var k in exams) {
        let opt = exams[k].qlistArr;
        let str = opt.join("");
        arr.push(str)
      }
      //   .log(arr.join(","));

      app.wxRequest('api/apiservice/sku/v1/sendQPResult', {
        skuId: skuId,
        skuType: skuType,
        text: text,
        cwId: cwId,
        qpId: qpId,
        isRes: isRes,
        answer: arr.join(",")
      }, 'POST', function (res) {
        // console.log(res);
        app.wxRequest('api/apiservice/sku/v1/userQuestionResult',
          { qpId: qpId, type: "0" }, 'POST', function (res) {
            // console.log(res.data);

            that.setData({
              userQuestionResult: res.data.data,
              fraction: parseInt(res.data.data.qpPoint),
              cwId:cwId,
              isRes: isRes,
              skuId:skuId,
              skuType :skuType,
              text: text
            })

          })

      })
    }
  },
  onShow: function () {
  },
  onHide: function () {
  },
  //继续学习
  go_medal: function () {
    wx.removeStorageSync("exam");
    let text = this.data.text;
    let skuType = this.data.skuType;

    if (skuType == "0") {
      
      wx.redirectTo({
        url: "../home_planDetails/home_planDetails?text=" + text
      })
    } else {
      wx.redirectTo({
        url: "../home_specialDetails/home_specialDetails?text=" + text
      })
    }
   
  },
  // 再考一次
  recur:function(){
    wx.removeStorageSync("exam");
    let cwId = this.data.cwId;
    let skuId = this.data.skuId;
    let skuType = this.data.skuType;
    let text = this.data.text;

    wx.redirectTo({
      url: '../hoem_exam/hoem_exam?cwId='
        + cwId
        + "&skuId=" + skuId
        + "&skuType=" + skuType
        + "&text=" + text
    })
  }
})