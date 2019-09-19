const backgroundAudioManager = wx.getBackgroundAudioManager();

var app = getApp();
var WxParse = require('../util/wxParse/wxParse.js');
const util = require('../util/util.js');
var dowmTimer, addTimer, userSeeImg, userSeeVideo, userSeeAudio, timeInterval

//播放时长增加,播放时长减少,用户查看图文时间,用户查看视频时间,用户查看音频时间
var micObj = {
  // 秒换时分
  sec_to_time: function (s) {
    var t;
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec.toFixed(0);
    }
    return t;
  },
  // 时分转秒
  time_to_sec: function (s) {

    var hour = s.split(':')[0];
    var min = s.split(':')[1];
    var sec = s.split(':')[2];
    s = parseInt(hour * 3600) + parseInt(min * 60) + parseInt(sec);
    return s;

  },
  // ++计时
  countAdd: function (initTime, that, allTime) {

    // 播放时长 + 1
    addTimer = setTimeout(function () {
      if (initTime == allTime) {
        clearTimeout(addTimer);
        clearTimeout(dowmTimer);
        return false;
      }
      // 播放时长
      initTime++;
      // 1s一次计时
      micObj.countAdd(initTime, that, allTime);
      // 秒转换字符串
      let time = micObj.sec_to_time(initTime);

      that.setData({
        playTime: time,
        sliderValue: initTime
      });
     
      
    }, 1000)


  },
  // --计时
  countDown: function (allTime, that, cwId, skuId, skuType) {

    // 总时长时间戳 - 1
    dowmTimer = setTimeout(function () {
      allTime--;
     
      if (allTime == 15) {
        app.wxRequest('api/apiservice/sku/v1/userStudyEndCW',
          { cwId: cwId, skuId: skuId, skuType: skuType }, 'POST', function (res) {
            console.log(res.data)
          })
      }
       // 1s一次计时
      micObj.countDown(allTime, that, cwId, skuId, skuType);
      // 秒转换字符串
      let num = micObj.sec_to_time(allTime);
      // 赋值给也页面总时间
      that.setData({
        allTime: num
      })

      
      
    }, 1000)
  },
  userSeeImgFun: function (that, time) {
    userSeeImg = setTimeout(function () {
      time++;

      micObj.userSeeImgFun(that, time);
      that.setData({
        userSeeImg: time
      });
      console.log("我是浏览图文时间:" + time);
    }, 1000)
  },
  userSeeVideoFun: function (that, time) {
    userrSeeVideoFun = setTimeout(function () {
      time++;
      micObj.userrSeeVideoFun(that, time);
      that.setData({
        userSeeVideoFun: time
      });
      console.log("我是浏览视频时间:" + time);
    }, 1000)
  },
  userSeeVideoFun: function (that, time) {
    userrSeeVideoFun = setTimeout(function () {
      time++;
      micObj.userSeeVideoFun(that, time);
      that.setData({
        userSeeVideoFun: time
      });
      console.log("我是浏览音频时间:" + time);
    }, 1000)
  },
}

Page({

  data: {
    audio_btn:true,//首次进入音频高亮
    detailsBox_title_init:true,//讲义
    audioBox_isShow:true,//音频盒子是否显示
    skuStudyPlanCWList:"",//课程选集列表
    allTime:"",//音频总长度
    allAudioTime:"",//视频总长度
    detailsInfo:"",//课件详情
    animationData:{},//音频动画
    rotateIndex:0,
    playTime: "00:00:00",//播放时间
    allTimeCunt: "",//用于计算的总时间
    isPlay: true,//播放按钮
    action: {
      method: ''
    },
    isMicPlay:true,//迷你播放
    cwAudioUrl:"",//音频地址
    cwVideoUrl:"",//视频地址
    barWidth: "",//进度条长度
    noTap:false,//重复点击
    cwId:null,
    cwClockStatus:"",//课程状态
    cwIdArr:[],//cw数组
    animationIsShow:false,//转圈动画
    backgroundAudioManagerTime:null,//背景音乐播放时间

    videoUrl: '',
    url: '',
    windHeight: "",//屏幕高度
    cwAudioId: null,//audioId
    numTime: "",//总时间的时间戳
    numPlay: "", //播放时间的时间戳
    
    detailValue: 0,//拖动时间
    sliderValue:0,//进度条的valve
    num: 0,
    home_animation: {},//动画
    audio_animation: {},
    audioIsShow: true,//迷你播放是否显示
    home_isShow: true,//主页面是否显示
    audio_isShow: true,//播放页是否显示
    isScroll: true,//滚动条是否滚动
    cwTextDetail: {},//图文数据
    audio_paly_box: false,//视频播放盒子
    audio_paly_time: 0,//视频播放时间
    userSeeImg: 1,//用户浏览图文时间
    userSeeVideoFun: 1,//用户浏览视频时间
    userSeeAudio: 1,//用户浏览音频时间
    myVideo: true,//视频是否显示音频上拉是隐藏视频
    scrollTops: null,//滚动条滚动高度
    textTal: 50,//图文高度
    videoBase: {},//音频数据
    cwId: '',
    
    pageInfoData: {
      comeDate: "",
      page_code: '5',
      page_info: '音频播放详情页',
      types: "2"
    },
  },
  onLoad: function (options) {
    var that = this;

    // 留言动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: '50% 50% 0',
    })
    this.animation = animation

    that.setData({
      cwId: options.cwId,
      skuId: options.skuId,
      skuType: options.skuType,
    })
    console.log(options);

    // that.data.cwId = "42"
    // that.data.skuId = "2"
    // that.data.skuType = "0"

    // 图文学习时长统计
    // userSeeImg = setInterval(function () {
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000;
    //   if (timestamp % 5 == 0) {
    //     app.learntime("2")
    //   }
    // }, 1000)

    
    // that.setData({
    //   cwId: options.id,
    //   linkText: options.linkText
    // })

    //统计
    // console.log(that.data.cwId);
    // micObj.userSeeImgFun(that, that.data.userSeeImg) 

    // 获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windHeight: res.windowHeight
        })
      }
    })
    

  },
  onShow: function (){

    var that = this;
    let allTimeCunt = that.data.allTimeCunt;
    let cwId = that.data.cwId;
    let skuId = that.data.skuId;
    let skuType = that.data.skuType;
    
    // let cwId = "42";
    // let skuId = "2";
    // let skuType = "0";

    let storCwId = wx.getStorageSync("cwId");
    let storSkuId = wx.getStorageSync("skuId")
    let storSkuType = wx.getStorageSync("skuType")

    // 判断是不是首次进入
    if (cwId == storCwId && skuId == storSkuId && skuType == storSkuType  ){
      that.init_data(that, storSkuType, storSkuId, storCwId)
    }else{
      wx.setStorageSync("cwId", cwId);
      wx.setStorageSync("skuId", skuId);
      wx.setStorageSync("skuType", skuType);
      that.init_data(that, skuType, skuId, cwId);
    }
    // 监听音乐播放
    backgroundAudioManager.onTimeUpdate(function () {
      
      let mic_cwId = that.data.cwId;
      let maxnum = Math.ceil(backgroundAudioManager.duration); //总时长
      let backgroundAudioManagerTime = Math.ceil(backgroundAudioManager.currentTime);//播放时长
      let allTimeCunts = micObj.time_to_sec(that.data.allTimeCunt);//总时长(12:00:00)
      let playTime = micObj.sec_to_time(backgroundAudioManagerTime);//播放时长(01:20:00)

      if (!backgroundAudioManagerTime) {
        app.showLoading("正在加载", 'loading');
      } else {
        that.setData({
          playTime: playTime,
          sliderValue: backgroundAudioManagerTime,
          backgroundAudioManagerTime: backgroundAudioManagerTime,
        })
      }

      if (backgroundAudioManagerTime > 30) {

        if (maxnum - backgroundAudioManagerTime < 15) {
          // 向后台传送时间
          if (that.data.audioIsPalyed == undefined) {
            app.wxRequest('api/apiservice/sku/v1/userStudyEndCW',
              { cwId: mic_cwId, skuId: skuId, skuType: skuType }, 'POST', function (res) {
                console.log("已学完");
                that.setData({
                  audioIsPalyed: 1
                })
            })

          }
        }
      }
      if (backgroundAudioManagerTime == allTimeCunts || allTimeCunts - backgroundAudioManagerTime < 2) {
       
        app.globalData.isMicPlay = false;
        that.setData({
          isPlay: true,
          animationIsShow: false,
          sliderValue: 0,
          backgroundAudioManagerTime: 0,
          playTime: "00:00:00",
        });
        backgroundAudioManager.stop();
        return false;
      }



    })

    // 音频自然播放完成
    backgroundAudioManager.onEnded(function(){
      console.log("结束了");
      app.globalData.isMicPlay = false;
      that.setData({
        isPlay: true,
        animationIsShow: false,
        sliderValue: 0,
        backgroundAudioManagerTime: 0,
        playTime: "00:00:00",
      });
      backgroundAudioManager.stop();
    })
    backgroundAudioManager.onPause(function(){
      that.pauseTap();
    })


   

    

    // 全局赋值本页面参数 统计等
    // app.globalData.pageInfoData.types = 2;
    // app.globalData.pageInfoData.params = '音频播放详情页';
    // let pageInfoData = that.data.pageInfoData;
    // var comeDate = Date.parse(new Date());
    // comeDate = comeDate / 1000;
    // that.setData({
    //   pageInfoData: {
    //     comeDate: comeDate
    //   }
    // })
  },
  onHide: function (options) {
    // var that = this;
    // let pageInfoData = that.data.pageInfoData;

    // let leaveDate = Date.parse(new Date());
    // leaveDate = leaveDate / 1000;
    // app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);

    var that = this;
    wx.setStorageSync("audioUrl", that.data.cwAudioUrl);
    wx.setStorageSync("playTime", that.data.playTime);
    wx.setStorageSync("sliderValue", that.data.sliderValue);
    wx.setStorageSync("cwId", that.data.cwId);
    console.log("我被隐藏了");

  },
  onUnload: function () {
    var that = this;
    wx.setStorageSync("audioUrl", that.data.cwAudioUrl);
    wx.setStorageSync("playTime", that.data.playTime);
    wx.setStorageSync("sliderValue", that.data.sliderValue);
    wx.setStorageSync("cwId", that.data.cwId);
    
  },
  init_data: function (that, skuType, skuId, cwId) {
    if (skuType == "0") {
      //正式学习计划详情页接口
      app.wxRequest('api/apiservice/sku/v1/skuStudyPlanDetailInfo',
        { skuId: skuId }, 'POST', function (res) {
          let detailsInfo = res.data.data;

          that.setData({
            detailsInfo: detailsInfo
          })

        })
      // 获取课件
      app.wxRequest('api/apiservice/sku/v1/skuStudyPlanCWList',
        { skuId: skuId }, 'POST', function (res) {
          let list = res.data.data;

          let arr = [];
          // 遍历删除考题，取出所有cwid留着上下曲用
          for (var i = 0; i < list.length; i++) {
            list[i].info = list[i].cwTitle.split(".")[1];
            if (list[i].cwType == "0") {
              arr.push(list[i].cwId);
            }
          }

          for (var j = 0; j < list.length; j++) {
            if (list[j].cwType == "1") {
              list.splice(j, 1)
            }
          }

          that.setData({
            skuStudyPlanCWList: list,
            cwIdArr: arr
          })
        })
      // 图文详情
      app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
        { cwId: cwId }, 'POST', function (res) {

          let cwTextDetail = res.data.data;//当前播放标题
          if (cwTextDetail.info) {
            cwTextDetail.info = cwTextDetail.cwName.split(".")[1];
          }

          let allTime = res.data.data.cwAudioLength;//当前音频长度
          let barWidth = micObj.time_to_sec(allTime);//进度条size
          let cwAudioId = res.data.data.cwAudioId;//音频id
          let cwVideoId = res.data.data.cwVideoId;//视频id
          var article = res.data.data.cwContentList;//富文本
          if (article) {
            WxParse.wxParse('article', 'html', article, that, 5);
          }

          // 获取音频url
          app.wxRequest('api/apiservice/media/v1/getplayallinfo',
            { videoId: cwAudioId }, 'POST', function (res) {
              var audioMp4 = res.data.data.playInfoList[1].playURL;
           
              // 如果有视频的话获取视频
              if (cwVideoId) {
        
                app.wxRequest('api/apiservice/media/v1/getplayallinfo',
                  { videoId: cwVideoId }, 'POST', function (res) {

                    let videoMp4 = res.data.data.playInfoList[1].playURL;
                    let audioUrl = wx.getStorageSync("audioUrl");
                    let playTime = wx.getStorageSync("playTime");
                    let sliderValue = wx.getStorageSync("sliderValue");

                    if (audioMp4 != audioUrl) {

                      that.setData({
                        cwTextDetail: cwTextDetail,
                        allTime: allTime,
                        allTimeCunt: allTime,
                        allAudioTime: res.data.data.playInfoList[1].duration,
                        barWidth: barWidth,
                        cwAudioUrl: audioMp4,
                        cwVideoUrl: videoMp4,
                        isPlay: false,
                        animationIsShow: true,
                        backgroundAudioManagerTime: null,//背景音乐播放时间
                      })
                      wx.setStorageSync("audioUrl", audioMp4);
                      that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName)
                    } else {
                      console.log("我接着播放")

                      that.setData({
                        cwTextDetail: cwTextDetail,
                        allTime: allTime,
                        allTimeCunt: allTime,
                        barWidth: barWidth,
                        cwAudioUrl: audioMp4,
                        cwVideoUrl: videoMp4,
                        isPlay: false,
                        animationIsShow: true,
                        sliderValue: sliderValue,
                        audioIsShow: true,
                        playTime: playTime,
                      })
                      that.backgroundAudioManager_play(audioUrl, cwTextDetail.cwName)
                    }
                })

              } else {

                let audioUrl = wx.getStorageSync("audioUrl");
                let playTime = wx.getStorageSync("playTime");
                let sliderValue = wx.getStorageSync("sliderValue");

                if (audioMp4 != audioUrl) {
                  that.setData({
                    cwTextDetail: cwTextDetail,
                    allTime: allTime,
                    allTimeCunt: allTime,
                    barWidth: barWidth,
                    cwAudioUrl: audioMp4,
                    isPlay: false,
                    animationIsShow: true,
                    backgroundAudioManagerTime: null,//背景音乐播放时间
                  })
                  wx.setStorageSync("audioUrl", audioMp4);
                  that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName)

                } else {
                  console.log("我接着播放")
                  that.setData({
                    cwTextDetail: cwTextDetail,
                    allTime: allTime,
                    allTimeCunt: allTime,
                    barWidth: barWidth,
                    cwAudioUrl: audioMp4,
                    isPlay: false,
                    animationIsShow: true,
                    sliderValue: sliderValue,
                    audioIsShow: true,
                    playTime: playTime,
                  })
                  that.backgroundAudioManager_play(audioUrl, cwTextDetail.cwName)
                }
              }

            })

        })
      // 专题各类信息获取
    } else {
      //专题详情接口
      app.wxRequest('api/apiservice/sku/v1/skuSubjectDetailInfo',
        { skuId: skuId }, 'POST', function (res) {

          that.setData({
            detailsInfo: res.data.data
          })

        })
      // 获取课件
      app.wxRequest('api/apiservice/sku/v1/skuSubjectCWList',
        { skuId: skuId }, 'POST', function (res) {
          let list = res.data.data;
          let arr = [];
          // 遍历删除考题，取出所有cwid留着上下曲用
          for (var i = 0; i < list.length; i++) {
            list[i].info = list[i].cwTitle.split(".")[1];
            if (list[i].cwType == "0") {
              arr.push(list[i].cwId);
            }
          }

          for (var j = 0; j < list.length; j++) {
            if (list[j].cwType == "1") {
              list.splice(j, 1)
            }
          }


          that.setData({
            skuStudyPlanCWList: list,
            cwIdArr: arr
          })
        })
      // 图文详情
      app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
        {
          cwId: cwId
        }, 'POST', function (res) {
          let cwTextDetail = res.data.data;//当前播放标题
          if (cwTextDetail.info) {
            cwTextDetail.info = cwTextDetail.cwName.split(".")[1];
          }

          let allTime = res.data.data.cwAudioLength;//当前音频长度
          let barWidth = micObj.time_to_sec(allTime);//进度条size
          let cwAudioId = res.data.data.cwAudioId;//音频id
          let cwVideoId = res.data.data.cwVideoId;//视频id
          if (res.data.data.cwContentList) {
            var article = res.data.data.cwContentList;//富文本
            WxParse.wxParse('article', 'html', article, that, 5);
          }
          // 获取音频url
          app.wxRequest('api/apiservice/media/v1/getplayallinfo',
            { videoId: cwAudioId }, 'POST', function (res) {

              var audioMp4 = res.data.data.playInfoList[1].playURL;
              // 如果有视频的话获取视频
              if (cwVideoId) {
                app.wxRequest('api/apiservice/media/v1/getplayallinfo',
                  { videoId: cwVideoId }, 'POST', function (res) {
                    console.log(res.data.data.playInfoList[1].duration)
                    let videoMp4 = res.data.data.playInfoList[1].playURL;
                    let audioUrl = wx.getStorageSync("audioUrl");
                    let playTime = wx.getStorageSync("playTime");
                    let sliderValue = wx.getStorageSync("sliderValue")

                    if (audioMp4 != audioUrl) {

                      that.setData({
                        cwTextDetail: cwTextDetail,
                        allTime: allTime,
                        allTimeCunt: allTime,
                        allAudioTime: res.data.data.playInfoList[1].duration,
                        barWidth: barWidth,
                        cwAudioUrl: audioMp4,
                        cwVideoUrl: videoMp4,
                        isPlay: false,
                        animationIsShow: true,
                        backgroundAudioManagerTime: null,//背景音乐播放时间
                      })

                      wx.setStorageSync("audioUrl", audioMp4);
                      that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName)
                    } else {
                      console.log("我接着播放")

                      that.setData({
                        cwTextDetail: cwTextDetail,
                        allTime: allTime,
                        allTimeCunt: allTime,
                        allAudioTime: res.data.data.playInfoList[1].duration,
                        barWidth: barWidth,
                        cwAudioUrl: audioMp4,
                        cwVideoUrl: videoMp4,
                        isPlay: false,
                        animationIsShow: true,
                        sliderValue: sliderValue,
                        audioIsShow: true,
                        playTime: playTime,
                      })
                      that.backgroundAudioManager_play(audioUrl, cwTextDetail.cwName)
                    }

                })
              } else {
                let audioUrl = wx.getStorageSync("audioUrl");
                let playTime = wx.getStorageSync("playTime");
                let sliderValue = wx.getStorageSync("sliderValue")

                if (audioMp4 != audioUrl) {
                  that.setData({
                    cwTextDetail: cwTextDetail,
                    allTime: allTime,
                    allTimeCunt: allTime,
                    barWidth: barWidth,
                    cwAudioUrl: audioMp4,
                    isPlay: false,
                    animationIsShow: true,
                    backgroundAudioManagerTime: null,//背景音乐播放时间
                  })

                  wx.setStorageSync("audioUrl", audioMp4);
                  that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName)

                } else {
                  console.log("我接着播放")
                  that.setData({
                    cwTextDetail: cwTextDetail,
                    allTime: allTime,
                    allTimeCunt: allTime,
                    allAudioTime: res.data.data.playInfoList[1].duration,
                    barWidth: barWidth,
                    cwAudioUrl: audioMp4,
                    isPlay: false,
                    animationIsShow: true,
                    sliderValue: sliderValue,
                    audioIsShow: true,
                    playTime: playTime,
                  })
                  that.backgroundAudioManager_play(audioUrl, cwTextDetail.cwName)
                }
              }
            })

        })
    }
  },
  // 音频播放
  backgroundAudioManager_play: function (src,title){
    var that = this;
    let backgroundAudioManagerTime = that.data.backgroundAudioManagerTime;

    if (backgroundAudioManagerTime == null || !backgroundAudioManagerTime || backgroundAudioManagerTime == "" || backgroundAudioManagerTime == 0 ){
      backgroundAudioManager.src = src
      backgroundAudioManager.title = title;
      backgroundAudioManager.startTime = 0;
    }else{
      console.log("有播放时长")
      backgroundAudioManager.src = src
      backgroundAudioManager.title = title;
      backgroundAudioManager.startTime = backgroundAudioManagerTime;
    }
    app.globalData.isMicPlay = true; 
    
  },
    //音频播放
  playTap: util.repeatFun(function (e) {
    var that = this;
    let cwAudioUrl = that.data.cwAudioUrl;
    let cwTextDetail = that.data.cwTextDetail;
    if (that.data.sliderValue != 0){
      console.log(that.data.sliderValue)
      backgroundAudioManager.play();
      backgroundAudioManager.seek(that.data.sliderValue)
    }else{
      that.backgroundAudioManager_play(that.data.cwAudioUrl, that.data.cwTextDetail.cwName);
    }
    app.globalData.isMicPlay = true; 
    // 1.开始播放
    that.setData({
      isPlay: false,
      animationIsShow: true
    })

    // 关闭查看图文定时器
    // clearInterval(userSeeImg);
                             
    // 音频学习时长统计
    // userSeeImg = setInterval(function () {
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000;
    //   if (timestamp % 5 == 0) {
    //     app.learntime("3")
    //   }
    // }, 1000)

    // let cwId = that.data.cwId
    // let skuId = that.data.skuId;
    // let skuType = that.data.skuType;

    // 3.总时长减少 初始时间增加
    // let playTime = micObj.time_to_sec(that.data.playTime);  //开始时间逐步增加的
    // let allTimeCunt = micObj.time_to_sec(that.data.allTime);//总时长逐渐减少的
    // let allTime = micObj.time_to_sec(that.data.allTimeCunt);//总时长不变的
    
    // 开始计时
    // micObj.countAdd(playTime, that, allTime);
    // micObj.countDown(allTimeCunt, that, cwId, skuId, skuType);
    
  }, 300),
  //音频暂停
  pauseTap: util.repeatFun(function (e) {
    var that = this;
    console.log("暂停了")
    backgroundAudioManager.pause();
    that.setData({
      isPlay: true,
      animationIsShow:false
    });
    app.globalData.isMicPlay = false; 

    // clearInterval(userSeeImg);
    // 图文学习时长统计
    // userSeeImg = setInterval(function () {
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000;
    //   if (timestamp % 5 == 0) {
    //     app.learntime("2")
    //   }
    // }, 1000)
    // let cwId = that.data.cwId;

    
    // wx.pauseBackgroundAudio()

    // clearTimeout(dowmTimer);
    // clearTimeout(addTimer);
    // let sec_time = micObj.time_to_sec(that.data.playTime);
   

    // 向服务器传送音频播放时长接口
    // app.wxRequest('api/apiservice/statistics/v1/fileplaytime',
    //   { cwId: cwId, fileId: this.data.cwAudioId, fileType: "0", playTime: sec_time }, 
    //   'POST', 
    //   function (res) {
    //     console.log(res.data);
    // })

  }, 300),
  //音频停止
  stopTap: function () {
   
    // clearInterval(userSeeImg);
    // // 图文学习时长统计
    // userSeeImg = setInterval(function () {
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000;
    //   if (timestamp % 5 == 0) {
    //     app.learntime("2")
    //   }
    // }, 1000)

    // clearTimeout(dowmTimer);
    // clearTimeout(addTimer);
    // let sec_time = micObj.time_to_sec(this.data.playTime);
    // let cwId = this.data.cwId;
    // app.wxRequest('api/apiservice/statistics/v1/fileplaytime',
    //   { cwId: cwId, fileId: this.data.cwAudioId, fileType: "0", playTime: sec_time }, 'POST', function (res) {
    //     console.log(res.data);
    //   })
    // this.setData({
    //   isPlay: true
    // })

  },
  // 下一曲按钮
  nextTap: function (e) {
   
    var that = this;
    let cwid = e.currentTarget.dataset.cwid;//当前点击的cwId
    let cwIdArr = that.data.cwIdArr;//当前课程所有的cwId数组
    let skuStudyPlanCWList = that.data.skuStudyPlanCWList;//当前数据
    let cwidIndex = cwIdArr[cwIdArr.indexOf(cwid) + 1];
    
  
    //如果所有的cwId数组中不包含这个点击的cwid
    if (cwIdArr.indexOf(cwidIndex) == -1) {
      console.log(cwIdArr.indexOf(cwid) )
      app.showLoading("已经是最后一个了", "none");
    } else {
      // 把当前的cwid+1完成下一曲
      app.showLoading("加载中", "loading");
      
      if (cwidIndex != undefined) {
        // 判断此课程是否解锁
        for (var i = 0; i < skuStudyPlanCWList.length; i++) {

          if (skuStudyPlanCWList[i].cwId == cwidIndex) {
            // 表示该课程已经解锁
            if (skuStudyPlanCWList[i].cwClockStatus == "1") {

              //标题富文本等内容
              app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
                { cwId: cwidIndex }, 'POST', function (res) {
                  
                  let cwTextDetail = res.data.data;
                  if (res.data.data.cwContentList) {
                    var article = res.data.data.cwContentList;
                    WxParse.wxParse('article', 'html', article, that, 5);
                  }

                  let allTime = res.data.data.cwAudioLength;
                  let barWidth = micObj.time_to_sec(allTime);//进度条size
                 
                  // 获取音频url
                  app.wxRequest('api/apiservice/media/v1/getplayallinfo',
                    { videoId: res.data.data.cwAudioId }, 'POST', function (res) {
                      
                      var audioMp4 = res.data.data.playInfoList[1].playURL;

                      that.setData({
                        cwId: cwidIndex,//当前播放的cwId
                        cwTextDetail: cwTextDetail,//标题等内容
                        allTime: allTime,//总时长计算用
                        allTimeCunt: allTime,//总时长显示的
                        cwAudioUrl: audioMp4, //MP4格式的播放地址
                        barWidth: barWidth,//进度条size
                        sliderValue: 0,//滚动条进度
                        playTime: "00:00:00",//初始化
                        backgroundAudioManagerTime: null,
                        isPlay: false,
                        animationIsShow: true,
                    })
                    // console.log("新Id=" + that.data.cwId)
                    backgroundAudioManager.stop();
                    that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName);
                  })
              })
            } else {
              app.showLoading("课程未解锁", "none");
            }
          }
        }
      }
      
    }

  },
  // 上一曲
  upTap: function (e) {
    var that = this;
    let cwid = e.currentTarget.dataset.cwid;
    let cwIdArr = that.data.cwIdArr;
    let skuStudyPlanCWList = that.data.skuStudyPlanCWList;
    let noTap = that.data.noTap;
    let cwidIndex = cwIdArr[cwIdArr.indexOf(cwid) - 1];
    console.log(cwIdArr)
    if (cwIdArr.indexOf(cwidIndex) == -1) {
      app.showLoading("已经是第一个了", "none");
    } else {
      
      app.showLoading("加载中", "loading");
      if (cwidIndex != undefined) {
        // 判断此课程是否解锁
        for (var i = 0; i < skuStudyPlanCWList.length; i++) {
          if (skuStudyPlanCWList[i].cwId == cwidIndex) {
            if (skuStudyPlanCWList[i].cwClockStatus == "1") {
            
              app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
                { cwId: cwidIndex }, 'POST', function (res) {
                  let cwTextDetail = res.data.data;
                  let allTime = res.data.data.cwAudioLength;
                  let barWidth = micObj.time_to_sec(allTime);//进度条size
                  var article = res.data.data.cwContentList;
                  if (article){
                    WxParse.wxParse('article', 'html', article, that, 5);
                  }
                  
                  // 获取视频url
                  app.wxRequest('api/apiservice/media/v1/getplayallinfo',
                    { videoId: res.data.data.cwAudioId }, 'POST', function (res) {
                      var audioMp4 = res.data.data.playInfoList[1].playURL;
                      that.setData({
                        cwId: cwidIndex,//当前播放的cwId
                        cwTextDetail: cwTextDetail,//标题等内容
                        allTime: allTime,//总时长计算用
                        allTimeCunt: allTime,//总时长显示的
                        cwAudioUrl: audioMp4, //MP4格式的播放地址
                        barWidth: barWidth,//进度条size
                        sliderValue: 0,//滚动条进度
                        playTime: "00:00:00",//初始化
                        rotateIndex: 0,
                        noTap: false,
                        backgroundAudioManagerTime: null,
                        isPlay: false,
                        animationIsShow: true,
                      })
                      that.backgroundAudioManager_play(audioMp4, cwTextDetail.cwName);

                  })
              })
            } else {
              app.showLoading("已经是第一个了", "none");
            }
          }
        }
      }
    }

  },
  //讲义点击
  detailsBoxJyTap:function(){
    var that = this;
    that.setData({
      detailsBox_title_init:true
    })
  },
  //课程选集点击
  detailsBoxCuorTap: function () {
    var that = this;
    that.setData({
      detailsBox_title_init: false
    })
  },
  // 视频切换到音频
  audio_btn_tap:function(){
    var that = this;
    let audioBox_isShow = that.data.audioBox_isShow;
    app.globalData.isMicPlay = true; 
    if (audioBox_isShow == false ){
      let playTime = wx.getStorageSync("playTime");
      let seek = micObj.time_to_sec(playTime);
      let cwAudioUrl = that.data.cwAudioUrl;
      let cwTextDetail = that.data.cwTextDetail;

      that.setData({
        audioBox_isShow: true,
        playTime: playTime,
        isPlay: false,
        animationIsShow: true,
        isMicPlay: true,//音频迷你播放
      })
      
      backgroundAudioManager.src = cwAudioUrl;
      backgroundAudioManager.title = cwTextDetail.cwName;
      backgroundAudioManager.startTime = seek;
      backgroundAudioManager.play();
    }else{
      console.log("hhh")
    }
   
    
    
  },
  // 音频切换到视频
  video_btn_tap:function(e){
    var that = this;
    let playTime = that.data.playTime;
    wx.setStorageSync("playTime", playTime);
    app.globalData.isMicPlay = false; 
    that.setData({
      audioBox_isShow: false,
      isMicPlay: false,//音频迷你播放
    })
    clearInterval(userSeeImg);
    // 图文学习时长统计
    userSeeImg = setInterval(function () {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (timestamp % 5 == 0) {
        app.learntime("2")
      }
    }, 1000)
    let cwId = this.data.cwId;

    // this.setData({
    //   action: {
    //     method: 'pause'
    //   }
    // });

    // clearTimeout(dowmTimer);
    // clearTimeout(addTimer);

    // this.setData({
    //   isPlay: true
    // })

    backgroundAudioManager.pause();
  },
  // 音频列表点击
  paly_audio_tap:function(e){
    var that = this;
    let noTap = that.data.noTap;
    let cwId = e.currentTarget.dataset.cwid;
    let cwClockStatus = e.currentTarget.dataset.cwclockstatus;

    if (cwClockStatus == "1"){
        if (cwId == that.data.cwId ){
          app.showLoading("正在播放", "none");
        }else{
          
          if (noTap) {
            return;
          }
          that.setData({
            noTap:true
          })

          app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
            { cwId: cwId }, 'POST', function (res) {
              console.log(res)
              let cwTextDetail = res.data.data;
              let allTime = res.data.data.cwAudioLength;
              let barWidth = micObj.time_to_sec(allTime);//进度条size
              var article = res.data.data.cwContentList;
              if (article ){
                WxParse.wxParse('article', 'html', article, that, 5);
              }
            
              // 获取音频url
              app.wxRequest('api/apiservice/media/v1/getplayallinfo',
                { videoId: res.data.data.cwAudioId }, 'POST', function (res) {
                  var audioMp4 = res.data.data.playInfoList[1].playURL;
                  that.setData({
                    cwId: cwId,//当前播放的cwId
                    cwTextDetail: cwTextDetail,//标题等内容
                    allTime: allTime,//总时长计算用
                    allTimeCunt: allTime,//总时长显示的
                    cwAudioUrl: audioMp4, //MP4格式的播放地址
                    barWidth: barWidth,//进度条size
                    sliderValue: 0,//滚动条进度
                    playTime: "00:00:00",//初始化
                    rotateIndex: 0,
                    noTap:false,
                    backgroundAudioManagerTime:null,
                    isPlay: false,
                    animationIsShow: true,
                  })
                  console.log(that.data.cwTextDetail.cwName)
                  that.backgroundAudioManager_play(audioMp4, that.data.cwTextDetail.cwName);
              })
          })

        }
    }else{
      let token = wx.getStorageSync("token");
      if (token != "" && token != null) {
        app.showLoading("课程未解锁", "none");
      }else{
        app.showLoading("请先登录", "none");
        var timer = setTimeout(function () {
          wx.redirectTo({
            url: '../../../../passwordLogin/passwordLogin'
          })
        }, 500)
      }
      
    } 
  },
  
  // 视频列表点击
  paly_video_tap: function (e) {
    var that = this;
    let noTap = that.data.noTap;
    let cwId = e.currentTarget.dataset.cwid;
    let cwClockStatus = e.currentTarget.dataset.cwclockstatus;

    if (cwClockStatus == "1") {
      if (cwId == that.data.cwId) {
        app.showLoading("正在播放", "none");
      } else {
        app.showLoading();
        if (noTap) {
          return;
        }
        that.setData({
          noTap: true
        })
        app.wxRequest('api/apiservice/sku/v1/cwTextDetail',
          { cwId: cwId }, 'POST', function (res) {
            let cwTextDetail = res.data.data;
            let allTime = res.data.data.cwAudioLength;
            let barWidth = micObj.time_to_sec(allTime);//进度条size
            var article = res.data.data.cwContentList;
            if (article ){
              WxParse.wxParse('article', 'html', article, that, 5);
            }
            // 获取视频url
            app.wxRequest('api/apiservice/media/v1/getplayallinfo',
              { videoId: res.data.data.cwVideoId }, 'POST', function (res) {
                var videoMp4 = res.data.data.playInfoList[1].playURL;
                
                that.setData({
                  cwId: cwId,//当前播放的cwId
                  cwTextDetail: cwTextDetail,//标题等内容
                  allTime: allTime,//总时长计算用
                  allAudioTime: res.data.data.playInfoList[1].duration,
                  allTimeCunt: allTime,//总时长显示的
                  cwVideoUrl: videoMp4, //MP4格式的播放地址
                  barWidth: barWidth,//进度条size
                  sliderValue: 0,//滚动条进度
                  playTime: "00:00:00",//初始化
                  audio_paly_time:0,//初始化视频
                  rotateIndex: 0,
                  noTap: false,
                })
            })
            backgroundAudioManager.pause();
          })

      }
    } else {
      let token = wx.getStorageSync("token");
      if (token != "" && token != null) {
        app.showLoading("课程未解锁", "none");
      } else {
        app.showLoading("请先登录", "none");
        var timer = setTimeout(function () {
          wx.redirectTo({
            url: '../../../../passwordLogin/passwordLogin'
          })
        }, 500)
      }
    }

    
  },
  // 进度条滑动
  bindchange: function (e) {
    // app.showLoading();
    // backgroundAudioManager.pause();
    // 1.停止定时器
    // clearTimeout(dowmTimer);
    // clearTimeout(addTimer);
    backgroundAudioManager.play();
    backgroundAudioManager.seek(e.detail.value)
    
    // 2.拖动时间
    let time = micObj.sec_to_time(e.detail.value);
    
    
    this.setData({
      sliderValue: e.detail.value,
      audioIsShow: true,
      playTime: time,
      isPlay: false,
      animationIsShow: true
    });
    // console.log(this.data.cwAudioUrl)
    // console.log(this.data.cwTextDetail.cwName);
    // backgroundAudioManager.play();
  },

  // 视频播放
  videoPlay: function () {
    console.log("视频播放了");
    clearInterval(userSeeImg);
    // 图文学习时长统计
    userSeeImg = setInterval(function () {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (timestamp % 5 == 0) {
        app.learntime("1")
      }
    }, 1000)
    this.pauseTap();
    this.stopTap();
  },
  // 视频暂停
  videoPause: function () {
    clearInterval(userSeeImg);
    // 图文学习时长统计
    userSeeImg = setInterval(function () {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (timestamp % 5 == 0) {
        app.learntime("2")
      }
    }, 1000)
    var that = this;
    let cwId = that.data.cwId;
    console.log("视频暂停了")
    let audioTime = that.data.audio_paly_time.toFixed()

    // app.wxRequest('api/apiservice/statistics/v1/fileplaytime',
    //   { cwId: cwId, fileId: this.data.cwAudioId, fileType: "1", playTime: audioTime }, 'POST', function (res) {
    //     console.log(res.data);
    //   })


    console.log("视频播放时长：" + audioTime)

    // 向服务器传送视频播放时长接口
    // app.wxRequest('api/apiservice/statistics/v1/filePlayTime',
    //   { cwId: cwId, fileId: "1", fileType: "1", playTime: audioTime }, 'POST', function (res) {
    // })

  },
  // 视频滑动
  videoChange: function (e) {
    var that = this;
    let time = parseInt(e.detail.currentTime);
    let cwId = that.data.cwId
    let skuId = that.data.skuId;
    let skuType = that.data.skuType;
    this.setData({
      audio_paly_time: e.detail.currentTime
    })
    let allAudioTime = that.data.allAudioTime;
    console.log(allAudioTime - time);
    if (allAudioTime - time < 10){
      
      if (that.data.videoIsPalyed != 1) {
        console.log("视频播放完成");
        app.wxRequest('api/apiservice/sku/v1/userStudyEndCW',
          { cwId: cwId, skuId: skuId, skuType: skuType }, 'POST', function (res) {
            that.setData({
              videoIsPalyed: 1
            })
          })
      }
    } 
    
  },
  bindtimeupdate: function (res) {
    console.log(res)//查看正在播放相关变量
    console.log("播放到第" + res.detail.currentTime + "秒")//查看正在播放时间，以秒为单位
  },
  // 去音频播放列表
  goPlayList: function () {

    wx.navigateBack(-1);
  },
  // 动画
  imgAnimation: function () {
    var that = this
    
    timeInterval = setInterval(function () {
     
      let allTime = micObj.time_to_sec(this.data.allTime);

      this.data.rotateIndex = this.data.rotateIndex + 1;
      this.animation.rotate(30 * this.data.rotateIndex).step()
      this.setData({
        animationData: this.animation.export()
      })

      // console.log(allTime);
      if (allTime == 0 ){
        wx.pauseBackgroundAudio();
        clearTimeout(dowmTimer);
        clearTimeout(addTimer);
        clearInterval(timeInterval);
        that.setData({
          playTime: "00:00:00",
          isPlay: true
        })
      }
    }.bind(this), 1000)
   
  },

})