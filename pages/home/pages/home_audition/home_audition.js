
var dowmTimer;
var addTimer;
// 秒换时分
function sec_to_time(s) {
  var time;
  if (s > -1) {
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;

    if (min < 10) {
      time += "0";
    }

    time = min + ":";
    if (sec < 10) {
      time += "0";
    }

    time += sec.toFixed(0);
  }
  return time;
}
// 时分转秒
function time_to_sec(time) {

  var s = '';
  var min = time.split(':')[0];
  var sec = time.split(':')[1];
  s = parseInt(min * 60) + parseInt(sec);
  return s;

}
// ++计时
function countAdd(that) {
  // 播放时长时间戳
  var second = that.data.numPlay
  // 播放时长 + 1
  addTimer = setTimeout(function () {
    that.setData({
      numPlay: second + 1
    });
    // 1s一次计时
    countAdd(that);
    // 秒转换字符串
    let num = sec_to_time(that.data.numPlay);

    // 赋值给也页面总时间
    that.setData({
      playTime: num
    });
  }, 1000)
}
// --计时
function countDown(that) {
  // 总时长时间戳
  var second = that.data.numTime
  // 总时长时间戳 - 1
  dowmTimer = setTimeout(function () {
    that.setData({
      numTime: second - 1
    });
    // 1s一次计时
    countDown(that);
    // 秒转换字符串
    let num = sec_to_time(that.data.numTime);
    // 赋值给也页面总时间
    that.setData({
      allTime: num
    });
  }, 1000)
}

Page({

  data: {
    item: [],
    windHeight: "",//屏幕高度
    playTime: "00:00",//播放时间
    allTime: "22:12",//总时间
    barWidth: "",//进度条长度
    numTime: "",//总时间的时间戳
    numPlay: "", //播放时间的时间戳
    num: 0,
    home_animation: {},//动画
    audio_animation: {},
    isPlay: true,//播放按钮
    isStop: false,//停止按钮
    audioIsShow: true,//迷你播放是否显示
    home_isShow: true,//主页面是否显示
    audio_isShow: false,//播放页是否显示
    isScroll: true,//滚动条是否滚动

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

    // 音频总时长转换成秒
    let numTime = time_to_sec(this.data.allTime);
    let numPlay = time_to_sec(this.data.playTime);
    this.setData({
      numTime: numTime,
      numPlay: numPlay,
      barWidth: numTime
    })

  },
  onShow: function () {
  },
  playTap: function () {
    countDown(this);
    countAdd(this);

    let allTime = this.data.allTime;

    this.setData({
      isPlay: false,
      isStop: true,
      audioIsShow: true
    })
    let url = this.data.url
  },
  pauseTap: function () {
    clearTimeout(dowmTimer);
    clearTimeout(addTimer);

    let newPlayTime = this.data.playTime

    this.setData({
      isPlay: true,
      isStop: false,
      audioIsShow: true
    })

    wx.pauseBackgroundAudio()

  },
  stopTap: function () {
    this.setData({
      isPlay: true,
      isStop: false,
      audioIsShow: false
    })
    wx.stopBackgroundAudio()
  },
  // 上来
  lessTap: function () {

    this.setData({
      audio_isShow: true
    })

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
    })
    this.animation = animation;
    animation.translateY(-300).step();
    this.setData({
      audio_animation: animation.export()
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
      audio_animation: animation.export()
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
        audio_isShow: false,
      })

    }.bind(this), 300)


  },
  // 去视频列表
  goVideoCourse: function () {
    wx.navigateTo({
      url: '../home_videoCourse/home_videoCourse',
    })
  }
})