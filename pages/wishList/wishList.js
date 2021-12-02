// page/wishList/wishList.js
var app = getApp();
Page({
  data:{
    infor: [],
    first: app.globalData.color.first,
    second: app.globalData.color.second
  },
  onLoad:function(){

  },
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
    this.setData({
    first: app.globalData.color.first,
    second: app.globalData.color.second
  })
  }
  
})