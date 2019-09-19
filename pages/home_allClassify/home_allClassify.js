var app = getApp();
Page({

  data: {
    industry_isShow: false,//行业板块是否显示
    screen_isShow: false,//筛选板块是否显示
    sort_isShow: false,//排序板块是否显示
    classify_content_isShow:false,//筛选盒子
    isShow_animation: {},//动画
    footer_isShow: true,//footer是否显示
    init_true:true,//推荐排序默认选中
    new_true: false,//最新上线
    more_true: false,//学习最多
    label_isColor:false,//行业是否选中
    condition_isColor: false, //筛选是否选中
    label_init_img:true,//行业初始icon
    platform: null,//手机系统

    home_data:{},//页面初始化数据
    init_data:{},//行业数据
    screen_data:{},//筛选数据
    label:"行业",
    condition:"筛选条件",
    sortTitle:"推荐排序",
    course_list:{}//课程列表
  },
  onLoad: function (options) {
    var that = this;
    
    let professionAjaxData = options.professionAjaxData || "";
    let professionAjaxDataArr = [];
    if (professionAjaxData != "" ){
      professionAjaxDataArr = professionAjaxData.split(",");
    }
    let gradeAjaxData = options.gradeAjaxData || "";
    let labelAjaxData = options.labelAjaxData || "";
    let grade_labels = options.grade_labels || "";
    let grade_label;
    if (grade_labels == undefined){
      grade_label = ""
    }else{
      grade_label = grade_labels.split(",")
    }

    

    wx.setStorageSync("professionAjaxData", professionAjaxData);
    
    //获取分类
    app.wxRequest('api/apiservice/sku/v1/getAppAllCategoryList',
      {}, 'POST', function (res) {

        // 获取行业数据
        var allData = res.data.data;
        // 行业数据
        var profession_Data = [];
        // 筛选条件
        let screen_data = [];
        // 分类title
        let label = [];
        // 筛选条件
        let condition = [];
        // 获取行业数据和筛选条件
        for( var i = 0;i < allData.length;i++ ){
          var list = allData[i].labelList;
          for (var j = 0; j < list.length; j++ ){
            // type等于0的话属于行业类
            if (list[j].type == 0) {
                
              // if (list[j].id == professionAjaxData  ){
              //   list[j].isTap = true;
              //   that.setData({
              //     label: list[j].title
              //   })
              // }
              

              profession_Data.push(list[j])
            }else{
              screen_data.push(list[j])
            }
          }
        }
        // console.log(screen_data)
        // 获取分类title
        // 如果行业数据有的话
        if (professionAjaxDataArr != ""  ){
          // console.log(professionAjaxDataArr)
          for (var a = 0; a < professionAjaxDataArr.length; a++) {
            for (var b = 0; b < profession_Data.length; b++) {
              if (professionAjaxDataArr[a] == profession_Data[b].id) {
                profession_Data[b].isTap = true;
                label.push(profession_Data[b].title);
              }
            }
          }

          if (grade_label != "" ){
           
            for (var z = 0; z < grade_label.length; z++) {
              for (var x = 0; x < screen_data.length; x++) {
                if (grade_label[z] == screen_data[x].id) {
                 
                  screen_data[x].isTap = true;
                  condition.push(screen_data[x].title);
                }
              }
            }
            that.setData({
              init_data: profession_Data,
              home_data: allData,
              screen_data: screen_data,
              label_isColor: true,
              label: label.join("、"),
              condition_isColor: true,
              condition: condition.join("、"),
              
            })
          }else{
            that.setData({
              init_data: profession_Data,
              home_data: allData,
              screen_data: screen_data,
              label_isColor: true,
              label: label.join("、"),
              condition_isColor: false,
              condition: "筛选条件"
            })
          }

        }else{
          
          if (grade_label != "") {
            console.log(grade_label)
            for (var z = 0; z < grade_label.length; z++) {
              for (var x = 0; x < screen_data.length; x++) {
                if (grade_label[z] == screen_data[x].id) {
                  console.log(screen_data[x])
                  screen_data[x].isTap = true;
                  condition.push(screen_data[x].title);
                }
              }
            }
            that.setData({
              init_data: profession_Data,
              home_data: allData,
              screen_data: screen_data,
              label_isColor:false,
              label: "行业",
              condition_isColor: true,
              condition: condition.join("、")
            })
          } else {
            that.setData({
              init_data: profession_Data,
              home_data: allData,
              screen_data: screen_data,
              label_isColor: false,
              label: "行业",
              condition_isColor: false,
              condition: "筛选条件"
            })
          }

        }
       
    })
    // 根据id获取课程列表
    app.wxRequest('api/apiservice/sku/v1/querySkuList',
      { type0: professionAjaxData, type1: gradeAjaxData, type2: labelAjaxData, orderType:"0"}, 'POST', function (res) {
        var arr = res.data.data
        console.log(res)
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        that.setData({
          course_list: arr
        })
    })
    if (!that.data.init_data) {
      app.showLoading("加载中", "loading")
    }
    
  },
  onReady: function () {
  },
  onShow: function () {
    app.showLoading("加载中","loading");
    this.setData({
      platform: app.globalData.platform
    })
  },
  onHide: function () {
    wx.removeStorageSync('gradeAjaxData');
    wx.removeStorageSync('labelAjaxData');
    wx.removeStorageSync('professionAjaxData');
    wx.removeStorageSync('sortAjaxData');
    wx.removeStorageSync('grade_label');
    
  },
  // 通用跳转函数
  com_tap: function (e) {
    console.log(12);
    let dataType = e.currentTarget.dataset.type;
    let dataId = e.currentTarget.dataset.text;
    let token = wx.getStorageSync("token");
    if (token == "" && token == null) {
      app.globalData.header["x-authorization"] = token;
      app.globalData.token = token
    }

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
      wx.navigateTo({
        url: '../webView/webView?url=' + e.currentTarget.dataset.text
      })
    }
  },
  // 行业点击
  industryTap:function(){
    var that = this;
    that.setData({
      classify_content_isShow: true,
      industry_isShow: true,
      sort_isShow:false,
      screen_isShow: false,
      footer_isShow: true
    })
  },
  // 筛选条件
  screenTap:function(){
    var that = this;
    that.setData({
      classify_content_isShow: true,
      industry_isShow: false,
      screen_isShow: true,
      sort_isShow: false,
      footer_isShow: true
    })
  },
  // 排序点击
  sortTap:function(){
    var that = this;
    that.setData({
      classify_content_isShow: true,
      industry_isShow: false,
      screen_isShow: false,
      sort_isShow: true,
      footer_isShow: false
    })
  },
  // 行业标签点击
  profession_blcok_tap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    var arr = that.data.init_data;
    var setData = that.data.init_data;
    var types = 0;
    that.com_label_tap(that, id, arr, types);
    
  },
  // 筛选标签点击
  grade_blcok_tap: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var arr = that.data.screen_data;
    var types = 1;
    that.com_label_tap(that, id, arr, types);
  },
  //  行业完成
  profession_finishTap:function(){
    var that = this;
    let arr = that.data.init_data;//行业数据
    let title_str = [];//行业title
    let ajaxData = [];//行业请求参数
    app.showLoading("加载中", "loading");
    // 获取标题及请求参数
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].isTap == true) {
       
        title_str.push(arr[j].title); 
        ajaxData.push(arr[j].id);
      }
    }
     // 给标题赋值
    if (title_str != "" ){
      that.setData({
        label: title_str.join("、"),
        label_isColor: true
      })
    }else{
      that.setData({
        label: "行业",
        label_isColor:false,
      })
    }

    // 存储到本地
    let professionAjaxData = ajaxData.join(",");
    wx.setStorageSync('professionAjaxData', professionAjaxData)

    // 获取请求参数
    let gradeAjaxData = wx.getStorageSync("gradeAjaxData");
    let labelAjaxData = wx.getStorageSync("labelAjaxData");
    let sortAjaxData = wx.getStorageSync("sortAjaxData");

    //获取课程列表 
    app.wxRequest('api/apiservice/sku/v1/querySkuList',
      { type0: professionAjaxData, type1: gradeAjaxData, type2: labelAjaxData, orderType: sortAjaxData }, 'POST', function (res) {
        app.showLoading("加载中", "loading");
        var arr = res.data.data
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        that.setData({
          course_list: arr,
          classify_content_isShow: false
        })
    })

  },
  //  行业重置按钮
  profession_resettingTap:function(){
    var that = this;
    var arr = that.data.init_data;//默认数据
    console.log(arr)
    // 清除选项
    for( var i = 0; i<arr.length;i++ ){
      arr[i].isTap = false;
    }
    that.setData({
      init_data: arr,
      label:"行业",
      label_isColor: false,
      classify_content_isShow: false
    })
    wx.removeStorageSync('professionAjaxData')
    app.wxRequest('api/apiservice/sku/v1/querySkuList',
      { type0:"", type1: "", type2: "", orderType: "0" }, 'POST', function (res) {
        var arr = res.data.data
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        that.setData({
          course_list: arr,
          classify_content_isShow: false
        })
    })

  },
  //  筛选条件完成
  screen_finishTap: function () {
    var that = this;
    let arr = that.data.screen_data;//筛选条件数据
    let title_str = [];//标题文字
    let ajaxData = [];//请求参数
    let gradeAjaxData = [];//等级请求参数
    let labelAjaxData = [];//标签请求参数
    
    // 获取标题及请求参数
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].isTap == true) {

        title_str.push(arr[j].title);
        ajaxData.push(arr[j].id);
      }
    }
    // 给标题赋值
    if (title_str != "") {
      that.setData({
        condition: title_str.join("、"),
        condition_isColor:true,
      })
    } else {
      that.setData({
        condition: "筛选条件",
        condition_isColor: false,
      })
    }
    
    // 区分等级和标签
    for (var i = 0; i < ajaxData.length;i++ ){
      if (ajaxData[i] < 4 || ajaxData[i] == "20" ){
        gradeAjaxData.push(ajaxData[i])
      }else{
        labelAjaxData.push(ajaxData[i])
      }
    }
    // 存储到本地
    let gradeAjaxStr = gradeAjaxData.join(",");
    let labelAjaxStr = labelAjaxData.join(",");
    wx.setStorageSync("gradeAjaxData", gradeAjaxStr);
    wx.setStorageSync("labelAjaxData", labelAjaxStr);

    // 获取行业请求参数
    let professionAjaxData = wx.getStorageSync("professionAjaxData");
    let sortAjaxData = wx.getStorageSync("sortAjaxData");

    // 发起请求获取课程列表
    app.wxRequest('api/apiservice/sku/v1/querySkuList',
      { type0: professionAjaxData, type1: gradeAjaxStr, type2: labelAjaxStr, orderType: sortAjaxData }, 'POST', function (res) {
        app.showLoading("加载中", "loading");
        var arr = res.data.data
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        that.setData({
          course_list: arr,
          classify_content_isShow: false
        })
    })

  },
  //  筛选条件重置按钮
  screen_resettingTap: function () {
    var that = this;
    var arr = that.data.screen_data;
    
    for (var i = 0; i < arr.length; i++) {
      arr[i].isTap = false;
    }
    console.log(arr)
    that.setData({
      screen_data: arr,
      condition: "筛选条件",
      condition_isColor: false,
      classify_content_isShow: false
    })
    wx.removeStorageSync('gradeAjaxData');
    wx.removeStorageSync('labelAjaxData');
    wx.removeStorageSync('grade_label');

    app.wxRequest('api/apiservice/sku/v1/querySkuList',
      { type0: "", type1: "", type2: "", orderType: "0" }, 'POST', function (res) {
        var arr = res.data.data
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        that.setData({
          course_list: arr,
          classify_content_isShow: false
        })
    })

  },
  // 推荐排序
  orderTpe:function(e){
    var that = this;
    var val = e.currentTarget.dataset.val;
    // 银行id
    let professionAjaxData = wx.getStorageSync("professionAjaxData") || "";
    // 等级id
    let gradeAjaxData = wx.getStorageSync("gradeAjaxData") || "";
    // 标签id
    let labelAjaxData = wx.getStorageSync("labelAjaxData") || "";
  
    if( val == "0" ){
      that.com_sort_tap(that, professionAjaxData, gradeAjaxData, labelAjaxData, val);
    }else if( val == "1" ){
      that.com_sort_tap(that, professionAjaxData, gradeAjaxData, labelAjaxData, val);
    }else{
      that.com_sort_tap(that, professionAjaxData, gradeAjaxData, labelAjaxData, val);
    }
  },
  // 同意排序点击
  com_sort_tap: function (that, professionAjaxData, gradeAjaxData,labelAjaxData,val) {
    
    wx.setStorageSync("sortAjaxData", val)
    
    app.wxRequest('api/apiservice/sku/v1/querySkuList',{ 
        type0: professionAjaxData, 
        type1: gradeAjaxData, 
        type2: labelAjaxData, 
        orderType: val 
      }, 'POST', function (res) {
        var arr = res.data.data
        app.showLoading("加载中", "loading");
        console.log(res.data.data)
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].label) {
            var str = arr[i].label.split(",");
            arr[i].label = str;
          }

        }
        if (val == "0" ){
          that.setData({
            course_list: arr,
            classify_content_isShow: false,
            sortTitle: "推荐排序",
            init_true: true,
            new_true: false,
            more_true: false,
          })
        } else if (val == "1"){
          that.setData({
            sortTitle: "最新上线",
            init_true: false,
            new_true: true,
            more_true: false,
            course_list: arr,
            classify_content_isShow: false
          })
        }else{
          that.setData({
            sortTitle: "学习最多",
            init_true: false,
            new_true: false,
            more_true: true,
            course_list: arr,
            classify_content_isShow: false
          })
        }
        
    })
  },
  animationFun:function(that,obj){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
    })

    animation.top(50).step();
    that.setData({
      obj: animation.export()
    })
  },
  // 浮层点击
  blockTap:function(){
    var that = this;
    that.setData({
      classify_content_isShow:false
    })
  },
  com_label_tap: function (that,id, arr,types){
    
    for (var i = 0; i < arr.length; i++) {
      // 添加class
      if (arr[i].id == id) {
        arr[i].isTap = !arr[i].isTap
        if (types == 0 ){
          that.setData({
            init_data: arr,
          })
        }else{
          that.setData({
            screen_data: arr,
          })
        }
      }
    }
  },

})