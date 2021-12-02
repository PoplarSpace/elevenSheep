// pages/add/add.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    isActive: true,
    // 主题色
    first: app.globalData.color.first,
    second: app.globalData.color.second,
    outData: [],
    inData: [],
    recordDate: "",
    cIndex: 0,
    recordContent: ""
  },

  // 点击 支出 按钮时 显示对应的内容
  oBtn: function () {
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
  changeDate: function (event) {
    // console.log(event);
    this.setData({
      recordDate: event.detail.value
    })
  },

  // 用户选择 花费 类型时，记录下来
  cTip: function (event) {
    // console.log(event);
    if (this.data.lock) {
      return;
    }
    var cIndex = event.currentTarget.dataset.index;
    this.setData({
      cIndex: cIndex,
      recordContent: event.currentTarget.dataset.content
    })
  },

  // 用户自定义添加类型的按钮
  addTips: function () {
    wx.navigateTo({
      url: 'addTip/addTip?isAcitve=' + this.data.isActive,
    })
  },

  // 用户长按删除某种类型
  removeType: function (event) {
    this.setData({
      lock: true
    })
    // console.log(event.currentTarget.dataset.index);
    var that = this;
    if (this.data.isActive) {
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
            lock: false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("tipOut")
    ) {
      var outData = wx.getStorageSync("tipOut");
    }
    else {
      var outArr = ["餐饮", "交通", "住房", "美容", "服饰", "运动"];
      wx.setStorageSync("tipOut", outArr);
      var outData = wx.getStorageSync("tipOut");
    }

    this.setData({
      outData: outData,
    })

    // 显示当前日期
    var recordDate = new Date();

    var year = recordDate.getFullYear();
    var month = recordDate.getMonth() + 1 < 10 ? "0" + (recordDate.getMonth() + 1) : recordDate.getMonth() + 1;
    var day = recordDate.getDate() < 10 ? "0" + recordDate.getDate() : recordDate.getDate();
    recordDate = year + "-" + month + "-" + day;

    this.setData({
      recordDate: recordDate,
      recordContent: this.data.outData
    })

    // 获取从 addTip 页面传过来的数据，并且存入本地数据中渲染页面
    if (JSON.stringify(options) != "{}") {
      // JSON.parse(options.addTips) ---- 将json形式的字符串转化为json对象

      var obj = JSON.parse(options.addTips);
      if (obj.isActive) {
        var arr = this.data.outData;
        arr.push(obj.type);
        this.setData({
          isActive: obj.isActive,
          outData: arr
        })
        wx.setStorageSync("tipOut", arr);
      }
    }


  },

  clear: function () {
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
    // 动态设置导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.color.first,
      animation: {
        duration: 400,
        timingFunc: 'linear'
      }
    })

    // 设置页面其他地方为用户选择的主题色
    this.setData({
      first: app.globalData.color.first,
      second: app.globalData.color.second
    })
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