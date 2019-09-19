
var loginUtil = {
  // 手机号
  phoneChange: function (that,phone) {
    let reg = /^1[34578][0-9]{9}$/;
    if (reg.test(phone)) {
      that.setData({
        phone: phone
      })
    } else {
      wx.showToast({
        title: "手机号输入有误",
        icon: "none"
      })
    }
  },
  // 密码
  passwordChange: function (that, password) {
    if (password.length < 4 || password.length > 12) {
        wx.showToast({
          title: "密码格式不正确",
          icon: "none"
        })
    }else{
      that.setData({
        password: password
      })
    }
  },
}

function repeatFun(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}


module.exports = {
  loginUtil: loginUtil,
   repeatFun: repeatFun
}