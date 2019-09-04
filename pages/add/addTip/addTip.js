// pages/add/addTip/addTip.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive:true,
    // 主题色
    first: app.globalData.color.first,
    second: app.globalData.color.second,
  },

  // 点击 支出 按钮时 显示对应的内容
  oBtn: function () {
    this.setData({
      isActive: true
    })
  },

  // 点击 收入 按钮时 显示对应的内容
  iBtn: function () {
    this.setData({
      isActive: false
    })
  },

  // 用户自定义类别之后，获取用户的输入内容，并且跳转回记一笔页面
  formSubmit:function(event){
    // console.log(event.detail.value.type);
    if (!event.detail.value.type){
      wx.showToast({
        title: '请输入想要添加的类型',
        icon: "none"
      })
    }
    else {
      var addTips = {
        type: event.detail.value.type,
        isActive: this.data.isActive
      }
      // console.log(addTips);

      wx.reLaunch({
        // JSON.stringify(addTips) ----- 把一个json对象转化为一个json字符串，因为url传值只能传字符串类型，不能传对象
        url: '../../add/add?addTips=' + JSON.stringify(addTips),
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isAcitve == "true"){
      var isActive = true;
    }
    else {
      var isActive = false;
    }
    this.setData({
      isActive:isActive
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