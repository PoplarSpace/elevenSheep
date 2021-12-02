// pages/me/me.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameShow:false,
    userInfo: app.globalData.userInfo,
    selected:false,
    // 主题色
    first: app.globalData.color.first,
    second: app.globalData.color.second,
    settingColor: app.globalData.color.str,
    color:{
      def:{
        first: "#12a182",
        second: "#c6dfc8",
        iconSelect0: "pages/img/绿/绿主页2.png",
        iconSelect1: "pages/img/绿/绿礼物2.png",
        iconSelect2: "pages/img/绿/绿添加2.png",
        iconSelect3: "pages/img/绿/绿社区2.png",
        iconSelect4: "pages/img/绿/绿我的2.png",
      },
      red:{
        first: "#ee3f4d",
        second: "#ffe3e3",
        iconSelect0: "pages/img/红/红主页2.png",
        iconSelect1: "pages/img/红/红礼物2.png",
        iconSelect2: "pages/img/红/红添加2.png",
        iconSelect3: "pages/img/红/红社区2.png",
        iconSelect4: "pages/img/红/红我的2.png",
      },
      blue: {
        first: "#afdcff",
        second: "#f4f9fd",
        iconSelect0: "pages/img/蓝/蓝主页2.png",
        iconSelect1: "pages/img/蓝/蓝礼物2.png",
        iconSelect2: "pages/img/蓝/蓝添加2.png",
        iconSelect3: "./pages/img/蓝/蓝社区2.png",
        iconSelect4: "./pages/img/蓝/蓝我的2.png",
      },
      pink: {
        first: "#ffcec0",
        second: "#fff4f0",
        iconSelect0: "pages/img/粉/粉主页2.png",
        iconSelect1: "pages/img/粉/粉礼物2.png",
        iconSelect2: "pages/img/粉/粉添加2.png",
        iconSelect3: "./pages/img/粉/粉社区2.png",
        iconSelect4: "./pages/img/粉/粉我的2.png",
      },
      cyan: {
        first: "#93fabc",
        second: "#e9fff2",
        
        iconSelect0: "pages/img/绿/绿主页2.png",
        iconSelect1: "pages/img/绿/绿礼物2.png",
        iconSelect2: "pages/img/绿/绿添加2.png",
        iconSelect3: "./pages/img/绿/绿社区2.png",
        iconSelect4: "./pages/img/绿/绿我的2.png",
      },
      orange: {
        first: "#ffd0a0",
        second: "#feffd8",
        
        iconSelect0: "pages/img/粉/粉主页2.png",
        iconSelect1: "pages/img/粉/粉礼物2.png",
        iconSelect2: "pages/img/粉/粉添加2.png",
        iconSelect3: "./pages/img/粉/粉社区2.png",
        iconSelect4: "./pages/img/粉/粉我的2.png",
      }
    }
  },

  // 用户登录授权
  loginInTap:function(){
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // console.log(res)
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            data: {
              code: res.code
            }
          })
          
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      desc:'展示用户信息',
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success(res) {
              // console.log("获取用户信息成功");
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              wx.setStorageSync("userInfo", res.userInfo);
              that.setData({
                userInfo: res.userInfo
              })
              that.setData({
                nameShow: true
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }
          })
        }
        else{
          console.log("获取用户信息失败！请检查您的网络连接！");
        }
      }
    })

    
  },

  // 用户退出登录
  loginOutTap:function(){
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync("userInfo");
          app.globalData.userInfo = null;
          that.setData({
            nameShow: false
          })
        }
      }
    })
  },

  // 用户自行清除账目方面的缓存
  clear: function () {
    wx.showModal({
      title: '删除',
      content: '确定删除您所有的账目信息吗？删除后将无法复原！',
      success(res){
        if(res.confirm){
          wx.removeStorageSync("recordJson");
          wx.showToast({
            title: '删除成功',
            duration:1000
          })

          // 设置延时
          setTimeout(function () {
            // 使用 wx.reLaunch 跳转页面后，所有页面才会重新加载数据，否则使用 tabBar 跳转到 “账本” 页面还是会加载之前缓存中的数据（因为已经取到本地了），要重启小程序才会清除账单。
            wx.reLaunch({
              url: '../me/me',
            })
          }, 1000)
          
          
        }
      }
    })
    
  },

  // 是否显示选择颜色的弹框
  selectColor:function(){
    this.setData({
      selected:!this.data.selected
    })
  },

  // 获取用户选择的颜色，并设置所有页面
  setColor:function(val,str){
    app.globalData.color.first = val.first;
    app.globalData.color.second = val.second;
    app.globalData.color.iconSelect0 = val.iconSelect0;
    app.globalData.color.iconSelect1 = val.iconSelect1;
    app.globalData.color.iconSelect2 = val.iconSelect2;
    app.globalData.color.iconSelect3 = val.iconSelect3;
    app.globalData.color.iconSelect4 = val.iconSelect4;
    app.globalData.color.str = str;
    this.onShow();
    this.setData({
      first: app.globalData.color.first,
      second: app.globalData.color.second,
      settingColor: app.globalData.color.str
    })
    
    // 动态设置tabBar上的图标
    wx.setTabBarItem({
      index: 0,
      selectedIconPath: app.globalData.color.iconSelect0
    })
    wx.setTabBarItem({
      index: 1,
      selectedIconPath: app.globalData.color.iconSelect1
    })
    wx.setTabBarItem({
      index: 2,
      selectedIconPath: app.globalData.color.iconSelect2
    })
    wx.setTabBarItem({
      index: 3,
      selectedIconPath: app.globalData.color.iconSelect3
    })
    wx.setTabBarItem({
      index: 4,
      selectedIconPath: app.globalData.color.iconSelect4
    })

    // 动态设置tabBar上的字体颜色
    wx.setTabBarStyle({
      color: '#333',
      selectedColor: this.data.first,
      borderStyle: 'black'
    })
    var color = {
      first: app.globalData.color.first,
      second: app.globalData.color.second,
      iconSelect0: app.globalData.color.iconSelect0,
      iconSelect1: app.globalData.color.iconSelect1,
      iconSelect2: app.globalData.color.iconSelect2,
      iconSelect3: app.globalData.color.iconSelect3,
      iconSelect4: app.globalData.color.iconSelect4,
      str: app.globalData.color.str
    }
    // 存入缓存是为了实现 在用户选择了主体颜色之后，下次进入页面时，就默认显示用户之前设置的颜色
    wx.setStorageSync("color", color);
  },

  // 选择某个颜色之后整个页面的变化
  mySelected:function(event) {
    // console.log(event.currentTarget.dataset.color)
    // 选择了某个主题色后，收起下拉框
    this.setData({
      selected: false,
    })
    // 匹配用户选择的颜色
    switch (event.currentTarget.dataset.color){
      case "默认":
        this.setColor(this.data.color.def,"(默认)");
        break;
      case "茶花红":
        this.setColor(this.data.color.red, "(茶花红)");
        break;
      case "冰川蓝":
        this.setColor(this.data.color.blue, "(冰川蓝)");
        break;
      case "落樱粉":
        this.setColor(this.data.color.pink, "(落樱粉)");
        break;
      case "清新绿":
        this.setColor(this.data.color.cyan, "(清新绿)");
        break;
      case "温暖橙":
        this.setColor(this.data.color.orange, "(温暖橙)");
        break;
      
    }
  },

  // 显示关于 joy记账 的内容
  showJoy:function(){
    wx.navigateTo({
      url: 'aboutMe/aboutMe',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      second: app.globalData.color.second,
      settingColor: app.globalData.color.str
    })

    // 动态设置tabBar上的图标
    wx.setTabBarItem({
      index: 0,
      selectedIconPath: app.globalData.color.iconSelect0
    })
    wx.setTabBarItem({
      index: 1,
      selectedIconPath: app.globalData.color.iconSelect1
    })
    wx.setTabBarItem({
      index: 2,
      selectedIconPath: app.globalData.color.iconSelect2
    })
    wx.setTabBarItem({
      index: 3,
      selectedIconPath: app.globalData.color.iconSelect3
    })
    wx.setTabBarItem({
      index: 4,
      selectedIconPath: app.globalData.color.iconSelect4
    })

    // 动态设置tabBar上的字体颜色
    wx.setTabBarStyle({
      color: '#333',
      selectedColor: this.data.first,
      borderStyle: 'black'
    })

    // 当页面刷新的时候，判断用户的登录状态，若已登录，则显示头像和昵称，防止清除账目时的页面重新刷新发生问题
    if (app.globalData.userInfo) {
      // console.log(app.globalData.userInfo);
      this.setData({
        nameShow: true,
        userInfo: app.globalData.userInfo
      })
    }
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