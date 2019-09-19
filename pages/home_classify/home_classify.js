var app = getApp();
Page({

 
  data: {
    allData:{},
    isTap:false,
    id_arr:[],
    disabled: true,//下一步按钮
    
  },

 
  onLoad: function (options) {
    var that = this;
    // 正式 学习计划banner接口
    app.wxRequest('api/apiservice/sku/v1/getAppAllCategoryList',
      {}, 'POST', function (res) {       
        var label_info = res.data.data;
        var obj = [];
        label_info.forEach((label) => {
          var arr = label.labelList;
          for (var i = 0; i < arr.length; i++) {
            arr[i].isTap = false;
            obj.push(arr[i]);
          }
        })
       
        that.setData({
          allData: label_info
        })
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  labeTap:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id
    let label_info = that.data.allData;
    

    var isTap = [];
    label_info.forEach((label) => {
      var arr = label.labelList;
      for (var i = 0; i < arr.length; i++) {
        // 添加class
        if (arr[i].id == id ){
          arr[i].isTap = !arr[i].isTap
          
          that.setData({
            allData: label_info,
          })
        }
        isTap.push(arr[i].isTap);
      }
    });
    // 底部完成
    if (isTap.indexOf(true) == -1 ){
      that.setData({
        disabled: true
      })
    }else{
      that.setData({
        disabled: false
      })
    }
  },
  nextTap:function(){
    var that = this;
    let label_info = that.data.allData;
    let isTapArr = [];
    let professionArr = [];//行业
    let gradeArr = [];//等级
    let labelArr = []; //标签
    
    let grade_label = [];

    label_info.forEach((label) => {
      var arr = label.labelList;
      for (var i = 0; i < arr.length; i++) {
        
        if (arr[i].isTap == true){
          // console.log(arr[i]);
          if (arr[i].type == 0 ){
            professionArr.push(arr[i].id)
          } else if (arr[i].type == 2){
            gradeArr.push(arr[i].id);
          }else{
            labelArr.push(arr[i].id);
          }
          //用于获取title
          if (arr[i].type != 0) {
            grade_label.push(arr[i].id)
          }
        }
      }
    });
   
    var professionAjaxData = professionArr.join(",");
    let gradeAjaxData = gradeArr.join(",")
    let labelAjaxData = labelArr.join(",")

    wx.setStorageSync("professionAjaxData", professionAjaxData)
    wx.setStorageSync("gradeAjaxData", gradeAjaxData)
    wx.setStorageSync("labelAjaxData", labelAjaxData)
    wx.setStorageSync("grade_label", grade_label)

    wx.navigateTo({
      url: "../home_allClassify/home_allClassify?professionAjaxData=" 
        + professionAjaxData + "&gradeAjaxData=" + gradeAjaxData + "&labelAjaxData=" 
        + labelAjaxData + "&grade_labels=" + grade_label
    })

  }
  
})