// pages/home/home.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: "",
    month: "",

    mIncome: 0,
    mExpend: 0,
    mSurplus: 0,
    cnt1: 0,
    cnt2: 0,
    cnt: 0,
    counter: 0,

    infor: [],
    // 主题色
    first: app.globalData.color.first,
    second: app.globalData.color.second,
    // 记账数据
    recordList: [],

  },

  // 改变首页上的日期时，改变对应的年月，并存入本地数据中
  dateChange: function (event) {
    // console.log(event.detail.value);
    var dateStr = event.detail.value;
    var arr = dateStr.split("-");
    this.setData({
      year: arr[0],
      month: arr[1]
    })

    var data = wx.getStorageSync("recordJson");
    // console.log("dateChange缓存中的数据是：",data);
    this.processData(data);
    this.caclMoney();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前时间的年和月，日期和月份的获取方法类似
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1);
    this.setData({
      year: year,
      month: month
    })

    this.caclMoney();


  },

  // 获取 收入 和 支出，计算每天的收入/支出，以及每月的收入/支出
  caclMoney: function () {

    var emIncome = 0;
    var emExpend = 0;
    var emSurplus = 0;

    for (var i = 0; i < this.data.infor.length; i++) {

      var edIncome = 0;
      var edExpend = 0;

      var strIncome = "infor[" + i + "].income";
      var strExpend = "infor[" + i + "].expend";

      for (var j = 0; j < this.data.infor[i].num.length; j++) {

        if (this.data.infor[i].num[j].gain != 0) {
          var gain = Number(this.data.infor[i].num[j].gain);
          edIncome += gain;
        }
        if (this.data.infor[i].num[j].pay != 0) {
          var pay = Number(this.data.infor[i].num[j].pay);
          edExpend += pay;
        }

      }
      this.setData({
        [strIncome]: edIncome,
        [strExpend]: edExpend
      })

      emIncome += this.data.infor[i].income;
      emExpend += this.data.infor[i].expend;
      emSurplus = emIncome - emExpend;

      this.setData({
        mIncome: emIncome,
        mExpend: emExpend,
        mSurplus: emSurplus
      })

    }
  },

  // 从缓存中取出用户添加的数据，并得到对应年月的数据
  // 并对日期进行排序
  getData: function (data, year, month) {
    for (var i = 0; i < data.length; i++) {
      if (Number(data[i].value) == Number(year)) {
        for (var j = 0; j < data[i].data.length; j++) {
          if (Number(data[i].data[j].value) == Number(month)) {
            return data[i].data[j].data;
          }
        }
      }
    }
  },

  // 判断年份是否是闰年
  isLeap: function (year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    }
    else {
      return false;
    }

  },

  // 判断某年某月某日是星期几
  whatDay: function (year, month, day) {
    var monthDay = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var sum = 0;
    //公元元年（也就是第一年）的第一天是星期1，以后的每一年与元年的差值取模7就可以算出该年的第一天是星期几。
    sum += (year - 1) * 365 + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) + day;
    for (var i = 0; i < month - 1; i++) {
      sum += monthDay[i];
    }
    if (month > 2) {
      if (this.isLeap(year)) {
        sum += 29;
      }
      else {
        sum += 28;
      }
    }
    return sum % 7;      //余数为0代表那天是周日，为1代表是周一，以此类推
  },

  // 处理从缓存中得到的数据
  processData: function (data) {
    if (data) {
      // 得到当前这个月的所有的数据
      var recordData = this.getData(data, this.data.year, this.data.month);
      // console.log("processData中的数据是：",recordData);
      // 代表整个月的数组
      var infor = [];

      var week = '';
      var year = Number(this.data.year);
      var month = Number(this.data.month);

      // 判断 所选月的数据是否为空
      if (recordData) {

        // 将所选月的数据按照日期从大到小排列出来
        for (var i = 0; i < recordData.length; i++) {
          for (var j = i + 1; j < recordData.length; j++) {
            if (recordData[i].value < recordData[j].value) {
              var a = recordData[i];
              recordData[i] = recordData[j];
              recordData[j] = a;
            }
          }
        }

        // 循环遍历 当前显示月 的 每一天
        for (var i = 0; i < recordData.length; i++) {
          // 临时存储"每一天"的对象
          var inforObj = {
            date: '',
            week: '',
            income: 0,
            expend: 0,
            num: [
              {
                content: '',
                pay: 0,
                gain: 0
              }
            ]
          }

          var date = this.data.month + "-" + recordData[i].value;
          // 算出 显示的日期 是星期几
          var day = Number(recordData[i].value);
          var weekNum = this.whatDay(year, month, day);
          switch (weekNum) {
            case 0:
              week = "日";
              break;
            case 1:
              week = "一";
              break;
            case 2:
              week = "二";
              break;
            case 3:
              week = "三";
              break;
            case 4:
              week = "四";
              break;
            case 5:
              week = "五";
              break;
            case 6:
              week = "六";
              break;
          }

          // 代表每一天中 的 每一条记录 的数组
          var num = [];

          if (recordData[i].data.length) {
            // 循环遍历 这一天 的所有记录
            for (var j = 0; j < recordData[i].data.length; j++) {
              // 临时存储 “每一条记录” 的对象
              var numObj = {
                content: '',
                pay: 0,
                gain: 0
              };
              var pay = 0;
              var gain = 0;
              let wishValue = recordData[i].data[j].wishValue;
              // 判断是 收入 还是 支出
              if (recordData[i].data[j].isActive) {
                pay = recordData[i].data[j].recordMoney;
              }
              else {
                gain = recordData[i].data[j].recordMoney;
              }
              // 收入/支出 的 类型 和 备注
              if (recordData[i].data[j].recordRemark) {
                var content = recordData[i].data[j].recordContent + "(" + recordData[i].data[j].recordRemark + ")";
              }
              else {
                var content = recordData[i].data[j].recordContent;
              }

              // 把得到的 某一天 的 某条数据 push 到 num 数组中
              numObj.content = content;
              numObj.gain = gain;
              numObj.pay = pay;
              numObj.wishValue = wishValue;
              num.push(numObj);

            }

            // 把得到的 当前月 的 所有天 的 所有数据 push 到 infor 数组中
            inforObj.date = date;
            inforObj.week = week;
            inforObj.num = num;
            console.log(infor)
            infor.push(inforObj);
          }
        }
      }

      this.setData({
        mIncome: 0,
        mExpend: 0,
        mSurplus: 0,
        infor: infor,
        recordList: num
      })
    }
  },

  // 长按删除某条记录
  delRecord: function (event) {
    var that = this;
    wx.showModal({
      title: '删除记录',
      content: '确定删除"' + that.data.infor[event.currentTarget.dataset.dayidx].date + '"的"' + that.data.infor[event.currentTarget.dataset.dayidx].num[event.currentTarget.dataset.recidx].content + '"这条记录吗？',
      success(res) {
        if (res.confirm) {
          var date = that.data.infor[event.currentTarget.dataset.dayidx].date;
          var year = that.data.year;
          var month = that.data.month;
          var day = date.split("-")[1];
          var record = that.data.infor[event.currentTarget.dataset.dayidx].num[event.currentTarget.dataset.recidx];
          var recordData = wx.getStorageSync("recordJson");
          for (var i = 0; i < recordData.length; i++) {
            if (Number(recordData[i].value) == Number(year)) {
              for (var j = 0; j < recordData[i].data.length; j++) {
                if (Number(recordData[i].data[j].value) == Number(month)) {
                  for (var k = 0; k < recordData[i].data[j].data.length; k++) {
                    if (Number(recordData[i].data[j].data[k].value) == Number(day)) {
                      // splice(index,len,[item])    注释：该方法会改变原始数组。
                      // index:数组开始下标        len: 替换/删除的长度       item:替换的值，删除操作的话 item为空
                      recordData[i].data[j].data[k].data.splice(event.currentTarget.dataset.recidx, 1);
                    }
                  }
                }
              }
            }
          }

          wx.setStorageSync("recordJson", recordData);
          wx.showToast({
            title: '删除成功',
          })
          that.onShow();
        }
      }
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
      selectedColor: app.globalData.color.first,
      borderStyle: 'black'
    })

    // 每次加载页面时，动态设置页面数据
    var data = wx.getStorageSync("recordJson");
    // console.log("onshow缓存中的数据是：" ,data);

    this.processData(data);
    console.log(this.data.infor);

    this.caclMoney();

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

  },
  updateLocalData: function () {

  },
  //期望值+1
  wishValueAdd: function (event) {
    console.log(event.currentTarget.dataset.index);
    let localData = wx.getStorageSync("recordJson")
    // 修改本地数据
    localData[0].data[0].data[0].data[event.currentTarget.dataset.index].wishValue = this.data.recordList[event.currentTarget.dataset.index].wishValue + 1
    wx.setStorageSync("recordJson", localData);
    //修改当前页面
    this.setData({
      recordList: this.data.recordList.map((e, index) => {
        if (index == event.currentTarget.dataset.index) {
          e.wishValue = e.wishValue + 1
        }
        return e
      })
    })
  },
  //期望值-1
  wishValueDetele: function (event) {
    console.log(event.currentTarget.dataset.index);
    let localData = wx.getStorageSync("recordJson")
    // 修改本地数据
    localData[0].data[0].data[0].data[event.currentTarget.dataset.index].wishValue = this.data.recordList[event.currentTarget.dataset.index].wishValue - 1
    wx.setStorageSync("recordJson", localData);
    this.setData({
      recordList: this.data.recordList.map((e, index) => {
        if (index == event.currentTarget.dataset.index) {
          e.wishValue = e.wishValue - 1
        }
        return e
      })
    })
  },
//计算期望总值
  count: function () {
    this.data.cnt = this.data.cnt1 + this.data.cnt2,
      console.log('期望值：' + this.data.cnt);
    this.setData({ counter: this.data.cnt })
  },
})

