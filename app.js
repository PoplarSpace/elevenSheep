//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
    
    // wx.removeStorageSync("color");
    if (wx.getStorageSync("color")) {
      this.globalData.color = wx.getStorageSync("color");
    }
    if (wx.getStorageSync("userInfo")) {
      this.globalData.userInfo = wx.getStorageSync("userInfo");
    }
    if (!wx.getStorageSync("userInfo")) {
      this.globalData.userInfo = null;
    }
    // 动态设置tabBar上的图标
    wx.setTabBarItem({
      index: 0,
      selectedIconPath: this.globalData.color.iconSelect0
    })
    wx.setTabBarItem({
      index: 1,
      selectedIconPath: this.globalData.color.iconSelect1
    })
    wx.setTabBarItem({
      index: 2,
      selectedIconPath: this.globalData.color.iconSelect2
    })
    // 动态设置tabBar上的字体颜色
    wx.setTabBarStyle({
      color: '#333',
      selectedColor: this.globalData.color.first,
      borderStyle: 'black'
    })    
  },
  globalData: {
    userInfo: null,
    color:{
      first: "#8be2dc",
      second: "#ebfbfb",
      iconSelect0: "pages/img/accountsSelected.png",
      iconSelect1: "pages/img/addSelected.png",
      iconSelect2: "pages/img/meSelected.png",
      str:"(默认)"
    }
  }
})