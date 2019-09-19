var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      questionDetail:{},
      cunt:0,//技术题的数量
      isChecked:false,//单选题重置按钮
      btnId:"",//选择的id
      examName:"",
      hoem_isShow:false,
      qpId:null,//考题id
      cwId:null,
      skuId:null,
      skuType:null,
      text:null

  },
  onLoad: function (options) {
    let cwId = options.cwId;
    let skuId = options.skuId;
    let skuType = options.skuType;
    let text = options.text;

    this.data.cwId = options.cwId;
    this.data.skuId = options.skuId;
    this.data.skuType = options.skuType;
    this.data.text = options.text;

  },
  onShow: function () {
    wx.removeStorageSync("exam")
    app.showLoading("加载中", "loading");

    var that = this;
    let cunt = this.data.cunt;
    // 主题板块
    let cwId = that.data.cwId
    let skuId = that.data.skuId
    let skuType = that.data.skuType
   

    // console.log("cwId=" + that.data.cwId)
    // console.log("skuId=" + that.data.skuId)
    // console.log("skuType=" + that.data.skuType)
    // let cwId = "78619f656e5b4563a0e9c53dd7cbdfa5"; 64

    app.wxRequest('api/apiservice/sku/v1/questionDetail', { cwId:cwId }, 'POST', function (res) {
      console.log(res);
      that.setData({
        questionDetail: res.data.data,
        hoem_isShow: true,
        qpId: res.data.data.qpId,

        cwId:cwId,
        skuId: skuId,
        skuType: skuType,

        // cwId:"64",
        // skuId: "9dbcd86556a1451a83b6319f3d487d1f",
        // skuType:"1"
      })

    })
  },
  onHide: function () {
  },
  // 单选点击
  radio_tap:function(e){
    var that = this;
    let cunt = this.data.cunt;//第几题
    let questionDetail = this.data.questionDetail;//这道题的数据
    let questionDetailList = questionDetail.qList[cunt].aList;//这道题的选项列表
    let btnId = e.currentTarget.dataset.btnid;//所选的id


    for (var i = 0; i < questionDetailList.length; i++) {
      if (questionDetailList[i].code == btnId) {
        questionDetailList[i].checked = true;
       
      }else{
        questionDetailList[i].checked = false;
      }
    }

    this.setData({
      btnId: btnId,
      questionDetail: questionDetail
    })
  },
  // 多选点击
  more_radio:function(e){
    var that = this;
    let cunt = this.data.cunt;//第几题
    let questionDetail = this.data.questionDetail;
    let questionDetailList = questionDetail.qList[cunt].aList;
    let btnId = e.currentTarget.dataset.btnid;
    let more_arr = [];

    for (var i = 0; i < questionDetailList.length;i++ ){
      if (questionDetailList[i].code == btnId ){
        questionDetailList[i].checked = !questionDetailList[i].checked
      }
      if (questionDetailList[i].checked ){
        more_arr.push(questionDetailList[i].code);
      }
    }
    if ( more_arr != "" ){
      this.setData({
        btnId: more_arr,
        questionDetail: questionDetail,
        isNext: true
      })
    }
    
  },
  // 上一题
  upExam:function(){
    var that = this;
    let btnId = this.data.btnId;//当前所选的
    let allCunt = this.data.questionDetail.qpCount//总共多少题
    let dic = wx.getStorageSync("exam") || {};//存储选项的对象
    let cunt = this.data.cunt;//第几题
    var qList = this.data.questionDetail.qList[cunt].aList;//当前选项数据
    let questionDetailType = this.data.questionDetail.qList[cunt];
    let exams = wx.getStorageSync("exam")[cunt];//当前题目存储的答案
    var qlistArr = [];//当前题目所选的答案


    let exam = wx.getStorageSync("exam")[cunt-1];//当前题目存储的答案
    let examBig = wx.getStorageSync("exam")[cunt];//当前题目存储的答案
  
    console.log(wx.getStorageSync("exam")[cunt-1])
    console.log(cunt);
    if (exam.qlistArr.length == 1 ){
      that.setData({
        btnId: exam.qlistArr
      })
    }else{
      that.setData({
        btnId: exam.qlistArr
      })
    }
    this.setData({
      cunt: cunt - 1
    })

   

  },
  // 下一题
  nextExam:function(){
    let btnId = this.data.btnId;//当前所选的
    let allCunt = this.data.questionDetail.qpCount;//总共多少题
    let dic = wx.getStorageSync("exam") || {};//存储选项的对象
    let cunt = this.data.cunt;//第几题
    var qList = this.data.questionDetail.qList[cunt].aList;//当前选项数据
    let questionDetailType = this.data.questionDetail.qList[cunt];
    let exam = wx.getStorageSync("exam")[cunt];//当前题目存储的答案
    var qlistArr = [];//当前题目所选的答案

    console.log(qList)
    console.log(questionDetailType.qType)

    if (btnId == "") {
      if( exam ){
        console.log(qlistArr);
        qlistArr = exam.qlistArr
        dic[cunt] = { qlistArr }
        wx.setStorageSync("exam", dic);
        this.setData({
          cunt: cunt + 1,
          isChecked: false,
          btnId: "",
          isNext: true
        })
      }else{
        app.showLoading("请选择答案", "none");
      }
    }else{
      
      //存储答案
      if (btnId != "" ){
        for (var i = 0; i < qList.length; i++) {
          // 如果是多选题时
          if (questionDetailType.qType == 1) {
            if (btnId.indexOf(qList[i].code) == -1) {
              qlistArr.push("0");
            } else {
              qlistArr.push(qList[i].code);
            }
          } else {
            if (btnId.indexOf(qList[i].code) != -1) {
              console.log(qList[i-1])
              qlistArr.push(qList[i].code);
            }
          }
        }
      }
  
      dic[cunt] = { qlistArr }
      wx.setStorageSync("exam", dic);

      this.setData({
        cunt: cunt + 1,
        isChecked: false,
        btnId: ""
      })

    }
    
      
  },
  // 去结果页
  go_result:function(){
    var that = this;
    let cunt = that.data.cunt;//第几题
    let allCunt = that.data.questionDetail.qpCount;//总共多少题
    var qList = this.data.questionDetail.qList[cunt].aList;//当前选项数据
    let btnId = that.data.btnId;
    var name = that.data.examName;
    var dic = wx.getStorageSync("exam") || {};
    let questionDetailType = this.data.questionDetail.qList[cunt];

    let cwId = that.data.cwId;
    let skuId = that.data.skuId;
    let skuType = that.data.skuType;
    let qpId = that.data.qpId;


    if (btnId != ""){
      var qlistArr = [];
      for (var i = 0; i < qList.length; i++) {
        // 如果是多选题时
        if (questionDetailType.qType == 1) {
          if (btnId.indexOf(qList[i].code) == -1) {
            qlistArr.push("0");
          } else {
            qlistArr.push(qList[i].code);
          }
        } else {
          if (btnId.indexOf(qList[i].code) != -1) {
            qlistArr.push(qList[i].code);
          }
        }
      }
      
      dic[cunt] = { qlistArr }
      wx.setStorageSync("exam", dic);
      this.setData({
        cunt: cunt,
        isChecked: false,
        btnId: ""
      })
      let text = that.data.text
      wx.redirectTo({
        url: '../home_result/home_result?skuId='
          + skuId + "&skuType=" + skuType + "&cwId="
          + cwId + "&qpId=" + qpId + "&text=" + text
      })

    }else{
      
      app.showLoading("请选择答案","none")

      // console.log(questionDetailType);
      // let questionDetailType = questionDetailType.aList
      // for (var j = 0; j < questionDetailType.length;j++ ){
      //   if (questionDetailType[j].checked == true ){

      //   }
      // }
    }

  },
  // 学学再考
  back_tap:function(){
    let text = this.data.text;
    let skuType = this.data.skuType;

    console.log(text)
    console.log(skuType)
    if (skuType == "0"){
      wx.redirectTo({
        url: "../home_planDetails/home_planDetails?text=" + text
      })
    }else{
      wx.navigateTo({
        url: "../home_specialDetails/home_specialDetails?text=" + text
      })
    }
    
  }
})
