// pages/add/add.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock:false,
    isActive:true,
    outData:[],
    inData: [],
    recordDate:"",
    cIndex: 0,
    recordContent:""
  },

  // 点击 支出 按钮时 显示对应的内容
  oBtn:function(){
    this.setData({
      isActive: true,
      cIndex: 0,
      recordContent: this.data.outData[this.data.cIndex]
    })
  },

  // 点击 收入 按钮时 显示对应的内容
  iBtn: function () {
    this.setData({
      isActive: false,
      cIndex: 0,
      recordContent: this.data.inData[this.data.cIndex]
    })
  },

  // 用户改变日期时，记录下来，并改变页面上的显示
  changeDate:function(event){
    // console.log(event);
    this.setData({
      recordDate:event.detail.value
    })
  },

  // 用户选择 花费 类型时，记录下来
  cTip:function(event){
    // console.log(event);
    if(this.data.lock){
      return;
    }
    var cIndex = event.currentTarget.dataset.index;
    this.setData({
      cIndex: cIndex,
      recordContent: event.currentTarget.dataset.content
    })
  },

  // 用户自定义添加类型的按钮
  addTips:function(){
    wx.navigateTo({
      url: 'addTip/addTip?isAcitve='+this.data.isActive,
    })
  },

  // 用户长按删除某种类型
  removeType:function(event){
    this.setData({
      lock:true
    })
    // console.log(event.currentTarget.dataset.index);
    var that = this;
    if(this.data.isActive){
      var arr = this.data.outData;
      wx.showModal({
        title: '删除类型',
        content: '是否确定删除"' + arr[event.currentTarget.dataset.index] + '"类型',
        success(res) {
          if (res.confirm) {
            var outData = wx.getStorageSync("tipOut");
            // splice(index,len,[item])    注释：该方法会改变原始数组。
            // index:数组开始下标        len: 替换/删除的长度       item:替换的值，删除操作的话 item为空
            outData.splice(event.currentTarget.dataset.index, 1);
            wx.setStorageSync("tipOut", outData);
            that.setData({
              outData: wx.getStorageSync("tipOut")
            })
          }
          that.setData({
            lock:false
          })
        }
      })
    }
    else {
      var arr = this.data.inData;
      wx.showModal({
        title: '删除类型',
        content: '是否确定删除' + '"' + arr[event.currentTarget.dataset.index] + '"' + "类型",
        success(res) {
          if (res.confirm) {
            var inData = wx.getStorageSync("tipIn");
            // splice(index,len,[item])    注释：该方法会改变原始数组。
            // index:数组开始下标        len: 替换/删除的长度       item:替换的值，删除操作的话 item为空
            inData.splice(event.currentTarget.dataset.index, 1);
            wx.setStorageSync("tipIn", inData);
            that.setData({
              inData: wx.getStorageSync("tipIn")
            })
          }
          that.setData({
            lock: false
          })
        }
      })
    }
    
  },

  // 向缓存中存数据
  addData:function(obj){
    var recordJson = wx.getStorageSync("recordJson");
    if(!recordJson){
      recordJson = [];
    }
    var record = {};
    if(recordJson.length){
      for (var i = 0; i < recordJson.length; i++) {
        if (obj.year == recordJson[i].value) {
          for (var j = 0; j < recordJson[i].data.length; j++) {
            if (obj.month == recordJson[i].data[j].value) {
              for (var k = 0; k < recordJson[i].data[j].data.length; k++) {
                if (obj.day == recordJson[i].data[j].data[k].value) {
                  record = {
                    recordContent: obj.recordContent,
                    recordMoney: obj.recordMoney,
                    recordRemark: obj.recordRemark,
                    isActive: obj.isActive
                  };
                  recordJson[i].data[j].data[k].data.push(record);
                  return recordJson;
                }
              }
              record = {
                value: obj.day,
                data: [
                  {
                    recordContent: obj.recordContent,
                    recordMoney: obj.recordMoney,
                    recordRemark: obj.recordRemark,
                    isActive: obj.isActive
                  }
                ]
              };
              recordJson[i].data[j].data.push(record);
              return recordJson;
            }
            
          }
          record = {
            value: obj.month,
            data: [
              {
                value: obj.day,
                data: [
                  {
                    recordContent: obj.recordContent,
                    recordMoney: obj.recordMoney,
                    recordRemark: obj.recordRemark,
                    isActive: obj.isActive
                  }
                ]
              }
            ]
          }
          recordJson[i].data.push(record);
          return recordJson;
        }
        
      }
      record = {
        value: obj.year,
        data: [
          {
            value: obj.month,
            data: [
              {
                value: obj.day,
                data: [
                  {
                    recordContent: obj.recordContent,
                    recordMoney: obj.recordMoney,
                    recordRemark: obj.recordRemark,
                    isActive: obj.isActive
                  }
                ]
              }
            ]
          }
        ]
      }
      recordJson.push(record);
      return recordJson;
    }
    else {
      record = {
        value: obj.year,
        data: [
          {
            value: obj.month,
            data: [
              {
                value: obj.day,
                data: [
                  {
                    recordContent: obj.recordContent,
                    recordMoney: obj.recordMoney,
                    recordRemark: obj.recordRemark,
                    isActive: obj.isActive
                  }
                ]
              }
            ]
          }
        ]
      }
      recordJson.push(record);
      return recordJson;
    }

  },

  // 表单提交，获取用户添加的 支出/收入 备注 日期 花费/收入
  formSubmit:function(event){
    // console.log(event);
    if (event.detail.value.recordMoney){
      var date = event.detail.value.recordDate;
      var year = date.split("-")[0];
      var month = date.split("-")[1];
      var day = date.split("-")[2];
      var recordData = {
        isActive: this.data.isActive,
        recordContent: this.data.recordContent,
        year: year,
        month: month,
        day: day,
        recordMoney: event.detail.value.recordMoney,
        recordRemark: event.detail.value.recordRemark
      };

      // console.log(recordData);    

      var recordJson = this.addData(recordData);

      wx.setStorageSync("recordJson", recordJson);

      // tabBar 跳转
      // 用switchTab跳转之后不会重新加载页面，比如input中的值会保留，用 reLaunch 的话则会重新加载页面，之前输入的值都不会保留

      // wx.switchTab({
      //   url: '../home/home'
      // })

      wx.reLaunch({
        url: '../home/home'
      })
    }
    else {
      wx.showToast({
        title: '请输入金额',
        duration: 2000,
        icon: "none"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("tipOut") && wx.getStorageSync("tipIn")){
      var outData = wx.getStorageSync("tipOut");
      var inData = wx.getStorageSync("tipIn");
    }
    else{
      var outArr = ["餐饮", "交通", "住房", "美容", "服饰", "运动"];
      var inArr = ["工资", "兼职", "礼金", "奖金"];
      wx.setStorageSync("tipOut", outArr);
      wx.setStorageSync("tipIn", inArr);
      var outData = wx.getStorageSync("tipOut");
      var inData = wx.getStorageSync("tipIn");
    }

    this.setData({
      outData:outData,
      inData:inData
    })

    // 显示当前日期
    var recordDate = new Date();
    // console.log(recordDate.toLocaleDateString());
    // recordDate = recordDate.toLocaleDateString().split("/").join("-");

    // recordDate = recordDate.toLocaleDateString().split("/").join("-");
    // recordDate = recordDate.toLocaleDateString().replace(/\//g, "-");  //正则表达式是对象，不加双引号

    //  console.log(recordDate);

    // var dateArr = recordDate.toLocaleDateString().split("/");
    // console.log(dateArr);

    // dateArr[1] = dateArr[1] < 10 ?"0" + dateArr[1] : dateArr[1];
    // recordDate = dateArr.join("-");

    var year = recordDate.getFullYear();
    var month = recordDate.getMonth() + 1 < 10 ? "0" + (recordDate.getMonth() + 1) : recordDate.getMonth() + 1;
    var day = recordDate.getDate() < 10 ? "0" + recordDate.getDate() : recordDate.getDate();
    recordDate = year + "-" + month + "-" + day; 
    
    this.setData({
      recordDate: recordDate,
      recordContent: this.data.outData[this.data.cIndex]
    })

    // 获取从 addTip 页面传过来的数据，并且存入本地数据中渲染页面
    if (JSON.stringify(options)!="{}"){
      // JSON.parse(options.addTips) ---- 将json形式的字符串转化为json对象
      // console.log(JSON.parse(options.addTips));

      var obj = JSON.parse(options.addTips);
      if(obj.isActive){
        var arr = this.data.outData;
        arr.push(obj.type);
        this.setData({
          isActive: obj.isActive,
          outData: arr
        })
        wx.setStorageSync("tipOut", arr);
      }
      else {
        var arr = this.data.inData;
        arr.push(obj.type);
        this.setData({
          isActive: obj.isActive,
          inData: arr
        })
        wx.setStorageSync("tipIn", arr);
      }
      
    }
    

  },

  clear:function(){
    wx.removeStorageSync("recordJson");
    wx.reLaunch({
      url: '../home/home',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})