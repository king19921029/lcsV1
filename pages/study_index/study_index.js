var app = getApp();
const util = require('../util/util.js');
var wxCharts = require('../util/wxcharts-min.js');
Page({
  data: {
    pageInfoData: {
      comeDate: "",//进入页面时间
      page_code: '8',
      page_info: '今日学习页'
    },
    isMicPlay: false,//音频迷你播放
    allDataIndex:0,//全部课程按钮
    course_index:null,
    isStudy:true,
    isCourse:null,
    isGrow:null,
    isScroll:true,
    token:null,
    studyState:false,//筛选中学习计划状态
    specialState:false,//专题状态
    columnState:false,//专栏状态
    getUserSkuList:{},//课程  
    getUserGrowupInfo:{},//成长记录
    echartTime:[],//图表学习时间
    echartdate:[],//图表数据
    code:null,
    items:[
      { title: '未学完'},
      { title: '已学完'},
      { title: '成长'},
    ],
    header_items:[
      { title: '学习中' },
      { title: '未学习' },
      { title: '已学习' },
    ],
    skuList:[
      { title: '学习计划' },
      { title: '专题课' },
      { title: '订阅专栏' },
    ],
    getUserTodayPlanList:null,
    screen:[],
    iphoneHeight:null,
    iphoneWidth: null
  },
  onLoad: function (options) {   
      var that = this;
      console.log("study load")
      app.showLoading("加载中", 'loading')
      wx.getSystemInfo({
        success: function (res) {
          //苹果5
          if (res.windowHeight == 456 ){
            that.setData({
              iphoneHeight: res.windowHeight/2-20,
              iphoneWidth: res.windowWidth
            })
          }else{
            that.setData({
              iphoneHeight: 260,
              iphoneWidth: res.windowWidth
            })
          }
          
          
        }
      })
  },
  onShow: function () {
    var that = this;
    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = '今日学习页';

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

    
    
    wx.setNavigationBarTitle({
      title: "学习"
    })

    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
      // 表示登录过期
      if (res.data.code != 0) {
        wx.removeStorageSync('token');
        app.globalData.token = null;
        that.setData({
          getUserTodayPlanList:null,
          code: res.data.code,
          currentTab: "0",
          studyState: false,//筛选中学习计划状态
          specialState: false,//专题状态
        })
      } else {
        let token = wx.getStorageSync("token");
        
        // 未学完
        app.wxRequest('api/apiservice/sku/v1/getUserSkuListForToday', 
          { status: "0" }, 'POST', function (res) {

          
          let lists = that.data.getUserTodayPlanList;
          let getUserTodayPlanList = res.data.data;
          var labelArr = [];
          if (getUserTodayPlanList != null) {
            for (var i = 0; i < getUserTodayPlanList.length; i++) {
              if (getUserTodayPlanList[i].label) {
                var str = getUserTodayPlanList[i].label.split(",");
                getUserTodayPlanList[i].label = str;
              }
            }

            that.setData({
              token: token,
              getUserTodayPlanList: getUserTodayPlanList,
              code: res.data.code,
              currentTab: "0",
              studyState: false,//筛选中学习计划状态
              specialState: false,//专题状态
            })
            
          }


        })
      }

    })

    console.log("study Show")
  },
  onReady:function(){
    
  },
  allData:function(){
    var that = this;

    app.wxRequest('api/apiservice/sku/v1/getUserSkuList', {}, 'POST', function (res) {
     
      that.setData({
        getUserSkuList: res.data.data,
        course_index: null
      })
    })
  },
  // 筛选
  tab_switch: util.repeatFun(function(e){

    var that = this;
    let index = e.currentTarget.dataset.index;
    var iphoneHeight = that.data.iphoneHeight;
    var iphoneWidth = that.data.iphoneWidth;
    
    console.log(iphoneHeight)
    if (index != 0 ){
      let token = that.data.token
      if(!token){
        wx.showToast({
          title: "请先登录",
          icon: "none"
        })
        var timer = setTimeout(function () {
          wx.navigateTo({
            url: '../passwordLogin/passwordLogin'
          })

        }, 500)
      }
    }
    
    if (index == 1){
      // 课程
      app.wxRequest('api/apiservice/sku/v1/getUserSkuListForToday', 
        { status: index }, 'POST', function (res) {
        let getUserTodayPlanList = res.data.data;
        console.log(getUserTodayPlanList);
        if (getUserTodayPlanList != "") {
          var labelArr = [];
          for (var i = 0; i < getUserTodayPlanList.length; i++) {

            if (getUserTodayPlanList[i].label) {
              var str = getUserTodayPlanList[i].label.split(",");
              getUserTodayPlanList[i].label = str;
            }
          }
        }

        that.setData({
          getUserTodayPlanList: getUserTodayPlanList
        })

      })

    } else if (index == 2){
     
      // 成长数据获取接口
      app.wxRequest('api/apiservice/sku/v1/getUserGrowupInfo',
        {}, 'POST', function (res) {
          // console.log(res.data);
          if (res.data.code == 0) {
            let echartList = res.data.data.timeList;
            let echartTime = [];
            let echartdate = [];
            for (var i = 0; i < echartList.length; i++) {
              echartTime.push(echartList[i].day)
              echartdate.push(echartList[i].time)
            }
            console.log(echartdate);
            
            new wxCharts({
              canvasId: 'columnCanvas',
              type: 'column',
              categories: echartTime,
              series: [{
                data: echartdate,
                format: function (val) {
                  return val + '分钟';
                },
                color: '#04ad76',
              }],
              yAxis: {
                // gridColor:"#ffffff",
                disabled: true,

              },
              xAxis: {
                disableGrid: true,

              },
              width: iphoneWidth, 
              height: iphoneHeight, 
              legend: false, // 是否显示图表下方各类别的标识
              dataLabel: true, // 是否在图表中显示数据内容值
              extra: {
                column: {
                  width: 15 // 柱状图每项的图形宽度，单位为px
                }
              }
            });

          }

          that.setData({
            getUserGrowupInfo: res.data.data
          })

      })

    } else if (index == 0){
  
      app.wxRequest('api/apiservice/sku/v1/getUserSkuListForToday',
        { status: "0" }, 'POST', function (res) {
          console.log(res)
          let getUserTodayPlanList = res.data.data;
          var labelArr = [];

          if (getUserTodayPlanList != null) {
            for (var i = 0; i < getUserTodayPlanList.length; i++) {
              if (getUserTodayPlanList[i].label) {
                var str = getUserTodayPlanList[i].label.split(",");
                getUserTodayPlanList[i].label = str;
              }
            }

            that.setData({
              getUserTodayPlanList: getUserTodayPlanList
            })
            console.log(getUserTodayPlanList)

          }


        })
      }

      that.setData({
        currentTab: index
      });
  
  }, 500),
  // 学习切换
  course_tab_switch(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
   
    app.wxRequest('api/apiservice/sku/v1/getUserSkuListForToday', { status:index }, 'POST', function (res) {
      let getUserTodayPlanList = res.data.data;
      console.log(getUserTodayPlanList);
      if (getUserTodayPlanList != "" ){
        var labelArr = [];
        for (var i = 0; i < getUserTodayPlanList.length; i++) {
          
          if (getUserTodayPlanList[i].label) {
            var str = getUserTodayPlanList[i].label.split(",");
            getUserTodayPlanList[i].label = str;
          }
        }
      }

      that.setData({
        getUserTodayPlanList: getUserTodayPlanList
      })
     
    })
    that.setData({
      course_index: index,
      allDataIndex:1
    });
  },
  // 去历史学习记录
  go_history(){
    wx.navigateTo({
      url: '../study/pages/study_history/study_history',
    })
  },
  //今日学习中列表跳转
  go_details(e){
    let id = e.currentTarget.dataset.id;
    let dataId = e.currentTarget.dataset.text;
    console.log(id);
    console.log(dataId)
    if(id == '学习计划'){
      wx.navigateTo({
        url: '../home/pages/home_planDetails/home_planDetails?text=' + dataId,
      })
    }else if(id == '专题课'){
      wx.navigateTo({
        url: '../home/pages/home_specialDetails/home_specialDetails?text=' + dataId,
      })
    }else if(id == '订阅专栏'){
      wx.navigateTo({
        url: '../home/pages/home_columnDetails/home_columnDetails?text=' + dataId,
      })
    }
  },
  // 课程跳转到详情
  to_details(e){
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
  // 回到主页
  go_home:function(){
    wx.switchTab({
      url: '../home_index/home_index',
    })
  },
  go_login:function(){
    wx.navigateTo({
      url:"../passwordLogin/passwordLogin"
    })
  },
  //获取数据通用函数
  getData: function (that, status, skuType){
    // 课程
    app.wxRequest('api/apiservice/sku/v1/getUserSkuList', { status: status, skuType: skuType}, 'POST', function (res) {
      console.log(res.data.data)
      that.setData({
        getUserSkuList: res.data.data
      })
    })
  },
  // 学习计划筛选选泽
  studyTab:function(e){
    let studyState = !this.data.studyState;
    this.setData({
      studyState: studyState,
    })

    if(this.data.studyState == true){
      this.setData({
        studyId: "0"
      })
    }else{
      this.setData({
        studyId:null
      })
    }
    console.log(this.data.studyId)

  },
  // 专题筛选选泽
  specialTab: function (e) {
    let specialState = !this.data.specialState;
    this.setData({
      specialState: specialState
    })
  },
  // 订阅专栏筛选选泽
  columnTab: function (e) {
    let columnState = !this.data.columnState;
    this.setData({
      columnState: columnState
    })

  },
  // 通用跳转函数
  com_tap: function (e) {

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
  // 播放浮窗
  mic_iconTap: function () {
    let cwId = wx.getStorageSync("cwId");
    let skuId = wx.getStorageSync("skuId");
    let skuType = wx.getStorageSync("skuType");

    wx.navigateTo({
      url: '../home_manuscript/home_manuscript?cwId='
        + cwId + '&linkText='
        + this.data.linkText
        + "&skuId="
        + skuId + "&skuType=" + skuType
    })
  },

})