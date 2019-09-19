
var util = require("../util/util.js");
Page({

  data: {
      phone:"",
      second:5,
      codeBtn:true,
      timeBtn:false,
  },

  onLoad: function (options) {
  
  },

  onShow: function () {
  
  },
  // 手机号
  phoneChange:function(e){
    var that = this;
    let phone = e.detail.value;
    that.setData({
      phone: phone
    })
  },
  // 获取验证码
  codeTap: function(e){
    var that = this;

    let reg = /^1[34578][0-9]{9}$/;
    if (reg.test(this.data.phone)) {
      util.countdown(that);
      that.setData({
        codeBtn:false,
        timeBtn:true
      })
     
    }else{
      console.log("请输入正确的手机号")
     
    }


  }


})