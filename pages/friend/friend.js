var app = getApp();
Page({
  data:{
    
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
  }
})