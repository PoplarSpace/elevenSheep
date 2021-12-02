//app.js
if (wx.getUserProfile) {
  /**
   * isCache  是否用户授权第一次，就把用户信息放到缓存中，以后不用获取最新的，直接拿缓存
   */
  let isCache = true

  Object.defineProperty(wx, 'getUserInfo', {
    configurable: true,
    value: function (callback) {
      if (wx.authorizationInfo) {
        callback.success(wx.authorizationInfo)
        return;
      } else if (isCache) {
        let storageInfo = wx.getStorageSync('authorizationInfo')
        if (storageInfo) {
          wx.authorizationInfo = storageInfo
          callback.success(wx.authorizationInfo)
          return;
        }
      }
      let success = callback.success
      callback.success = function (e) {
        wx.authorizationInfo = e
        if (isCache) {
          wx.setStorageSync('authorizationInfo', e)
        }
        success(e)
      }
      wx.getUserProfile({
        desc: '展示用户信息',
        ...callback
      });
    }
  })
}
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
    wx.setTabBarItem({
      index: 3,
      selectedIconPath: this.globalData.color.iconSelect3
    })
    wx.setTabBarItem({
      index: 4,
      selectedIconPath: this.globalData.color.iconSelect4
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
      iconSelect0: "pages/img/绿/绿车.png",
      iconSelect1: "pages/img/绿/绿喷射.png",
      iconSelect2: "pages/img/绿/绿加.png",
      iconSelect3: "./pages/img/绿/绿住民.png",
      iconSelect4: "./pages/img/绿/绿咩.png",
      str:"(默认)"
    }
  }
})