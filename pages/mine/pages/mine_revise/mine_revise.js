var app = getApp();

function timestampToTime(timestamp) {
  var date = new Date(timestamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + '';
  // let h = date.getHours() + ':';
  // let m = date.getMinutes() + ':';
  // let s = date.getSeconds();
  return Y + M + D;
}

Page({

  data: {
    Id:"",
    HeaderUrl:"",
    Name:"",
    Sex:null,
    Birthdate:"",
    CityId:"", 
    JobType: "",
    JobName:"",
    WorkYear:"",
    WorkUnit:"",
    sex: ['男', '女', ],
    index: 0,
    date:"2018-03",
    province:[],//省份
    provinceIdx:0,//省份下表
    occupation:[],//职业
    occupationIdx:"",//职业下表
    initUser:{},//获取用户信息
    updateinfo:{},//更新用户信息
    pageInfoData: {
      comeDate: "",//进入页面时间
      page_code: '14',
      page_info: '修改个人信息页'
    },
  },

  onLoad: function (options) {
    var that = this;
   
    // 省市县
    app.wxRequest('api/apiservice/meta/v1/queryprovinces', {}, 'POST', function (res) {
      // console.log(res.data.data)
      let province = [];
      let id = [];

      for (var i = 0; i < res.data.data.length;i++ ){
        province.push(res.data.data[i].province)
        id.push(res.data.data[i].provinceid)
      }
    
      that.setData({
        province: province,
        id: id
      })
      console.log(province)
    })

    // 职业类型
    app.wxRequest('api/apiservice/meta/v1/queryprofession', {}, 'POST', function (res) {
     
      let occupation = [];
      let id = [];
      for (var i = 0; i < res.data.data.length; i++) {
        occupation.push(res.data.data[i].name)
        id.push(res.data.data[i].id)
      }
      that.setData({
        occupation: occupation,
        occupationId: id
      })
      console.log(that.data.occupation)
    })
    
  },
  onShow: function () {
    var that = this;

    // 全局赋值本页面参数
    app.globalData.pageInfoData.types = 2;
    app.globalData.pageInfoData.params = '修改个人信息页';

    // 用户进入页面时间
    let pageInfoData = that.data.pageInfoData;
    var comeDate = Date.parse(new Date());
    comeDate = comeDate / 1000;

    that.setData({
      pageInfoData: {
        comeDate: comeDate,
        page_code: '14',
        page_info: '修改个人信息页'
      }
    })

    // 用户打开页面
    app.userSeePage(pageInfoData.page_code, pageInfoData.page_info);


    app.wxRequest('api/apiservice/user/v1/getuserinfo', {}, 'POST', function (res) {
      let initUser = res.data.data;
      let birthdate = timestampToTime(initUser.birthdate)
      that.setData({
        HeaderUrl: initUser.headerUrl,
        Name: initUser.nickName,
        Sex: initUser.sex,
        Birthdate: birthdate,
        CityId: initUser.cityId,
        JobType: initUser.jobType,
        JobName: initUser.jobName,
        WorkYear: initUser.workYear,
        WorkUnit: initUser.workUnit,
      })
      console.log(res.data.data)
      console.log(that.data.Birthdate)
    })
  },
  onHide: function () {
    var that = this;
    let pageInfoData = that.data.pageInfoData;

    let leaveDate = Date.parse(new Date());
    leaveDate = leaveDate / 1000;

    app.userSeePageTime(pageInfoData.page_code, pageInfoData.page_info, pageInfoData.comeDate, leaveDate);
  },
  // 页面卸载更新个人信息
  onUnload:function(){
    console.log(this.data.Birthdate)
    let updateinfo = this.data.updateinfo;
  
    let token = wx.getStorageSync("token");
    // let HeaderUrl = this.data.HeaderUrl;

    let nickName = this.data.Name;

    let headerUrl = this.data.HeaderUrl
    let sex = parseInt(this.data.Sex)
    let birthdate = this.data.Birthdate
    let cityId = this.data.CityId
    let jobType = this.data.JobType
    let jobName = this.data.JobName
    let workYear = parseInt(this.data.WorkYear)
    let workUnit = this.data.WorkUnit

    console.log("token:"+token)
    console.log("姓名:"+nickName)
    // console.log(headerUrl)
    console.log("性别:"+sex)
    console.log("生日:"+birthdate)
    console.log(cityId)
    console.log("职业类型:" +jobType)
    console.log("职业名称:" +jobName)
    console.log("工作年限:" +workYear)
    console.log("工作单位:" +workUnit)

    app.wxRequest('api/apiservice/user/v1/updateinfo', {
      token: token, nickName: nickName, sex: sex, workUnit: workUnit,
      headerUrl: headerUrl, cityId: cityId,
       birthdate: birthdate,
      jobType: jobType, jobName: jobName, workYear: workYear, 
    }, 'POST', function (res) {
        console.log(res.data);
    })
  },
  // 头像
  setInfo: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        console.log(res)
      
        let url = app.globalData.url + "api/apiservice/media/v1/uploadheaderimg"
       
        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          // formData: {
          //   "fileField": res.tempFiles
          // },
          success: function (res) {
            console.log(res.data)
          }
        })


        // app.wxRequest('api/apiservice/media/v1/uploadheaderimg', { fileField: res.tempFilePaths}, 'POST', function (res) {
    
        // })
        
        
      }
    })

   
  },
  // 获取姓名
  userName:function(e){
    this.setData({
      Name: e.detail.value
    })

  },
  // 性别修改及获取
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
      Sex: e.detail.value
    })
  },
  // 日期修改及获取
  bindDateChange: function (e) {
    var time = timestampToTime(e.detail.value);
    console.log(time);
    this.setData({
      date:time,
      Birthdate: time
    })
    console.log(this.data.Birthdate);
  },
  // 城市选择
  bindRegionChange: function (e) {
    let id = this.data.id[e.detail.value]
    this.setData({
      provinceIdx: e.detail.value,
      CityId: this.data.province[e.detail.value],
    })
    console.log(this.data.CityId)
  },
  // 职业类型选择及获取
  bindWorkType:function(e){
    let id = this.data.id[e.detail.value]
    this.setData({
      occupationIdx: e.detail.value,
      JobType: this.data.occupation[e.detail.value]
    })
   
    console.log(id);
  },
  // 职业名称获取
  bindWorkName:function(e){
    this.setData({
      JobName: e.detail.value
    })
  },
  // 工作年限
  bindWorkTime:function(e){
    this.setData({
      WorkYear: e.detail.value
    })
  },
  // 工作单位
  bindWorkUnit:function(e){
    this.setData({
      WorkUnit: e.detail.value
    })
    console.log(this.data.WorkUnit)
  },

 
})