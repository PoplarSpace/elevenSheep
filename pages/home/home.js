// pages/home/home.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // date: "1998-09"
    year:"",
    month:"",

    mIncome:0,
    mExpend:0,
    mSurplus:0,

    infor: []
    
    // infor: [
    //   {
    //     date: '07-15',
    //     week: '一',
    //     income: 0,
    //     expend: 0,
    //     num: [
    //       {
    //         content: '吃苹果',
    //         pay: 80,
    //         gain:0
    //       },
    //       {
    //         content: '火龙果',
    //         pay: 50,
    //         gain: 0
    //       },
    //       {
    //         content: '发工资',
    //         pay:0,
    //         gain: 10000
    //       }
    //     ]
    //   },
    //   {
    //     date: '07-16',
    //     week: '二',
    //     income: 0,
    //     expend: 0,
    //     num: [
    //       {
    //         content: '吃苹果',
    //         pay: 1000,
    //         gain: 0
    //       },
    //       {
    //         content: '火龙果',
    //         pay: 500,
    //         gain: 0
    //       }
    //     ]
    //   },
    //   {
    //     date: '07-17',
    //     week: '三',
    //     income: 0,
    //     expend: 0,
    //     num: [
    //       {
    //         content: '发工资',
    //         pay: 0,
    //         gain: 10000
    //       }
    //     ]
    //   },
    // ],

  },

  // 改变首页上的日期时，改变对应的年月，并存入本地数据中
  dateChange:function(event) {
    // console.log(event.detail.value);
    var dateStr = event.detail.value;
    var arr = dateStr.split("-");
    this.setData({
      year:arr[0],
      month:arr[1]
    })

    var data = wx.getStorageSync("recordJson");
    console.log("dateChange缓存中的数据是：",data);
    this.processData(data);
    this.caclMoney();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.removeStorageSync("tipOut");
    // wx.removeStorageSync("tipIn");

    // var year = this.data.date.split("-")[0];
    // this.setData({
    //   year:year
    // })

    // 获取当前时间的年和月，日期和月份的获取方法类似
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1);
    this.setData({
      year:year,
      month:month
    })

    this.caclMoney();

    // app.globalData.recordData = {};

  },

  // 获取 收入 和 支出，计算每天的收入/支出，以及每月的收入/支出
  caclMoney:function(){
    
    var emIncome = 0;
    var emExpend = 0;
    var emSurplus = 0;

    for (var i = 0; i < this.data.infor.length; i++) {

      var edIncome = 0;
      var edExpend = 0;

      var strIncome = "infor[" + i + "].income";
      var strExpend = "infor[" + i + "].expend";

      for (var j = 0; j < this.data.infor[i].num.length; j++) {

        // console.log(this.data.infor[i].num[j].gain);
        // console.log(this.data.infor[i].num[j].pay);

        if (this.data.infor[i].num[j].gain != 0) {
          var gain = Number(this.data.infor[i].num[j].gain);
          edIncome += gain;
        }
        if (this.data.infor[i].num[j].pay != 0) {
          var pay = Number(this.data.infor[i].num[j].pay);
          edExpend += pay;
        }

      }

      // console.log(edIncome);
      // console.log(edExpend);

      this.setData({
        [strIncome]: edIncome,
        [strExpend]: edExpend
      })

      // console.log(this.data.infor[i].income);
      // console.log(this.data.infor[i].expend);

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
  getData:function(data,year,month){
    for(var i=0;i<data.length;i++){
      if (Number(data[i].value) == Number(year)){
        for(var j=0;j<data[i].data.length;j++){
          if (Number(data[i].data[j].value) == Number(month)){
            // console.log("getData中的月是：" + data[i].data[j].value);
            return data[i].data[j].data;
          }
        }
      }
    }
  },

  // 判断年份是否是闰年
  isLeap:function(year){
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    }
    else {
      return false;
    }

  },

  // 判断某年某月某日是星期几
  whatDay:function(year, month, day){
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
  processData:function(data){
    if (data) {
      // 得到当前这个月的所有的数据
      var recordData = this.getData(data,this.data.year,this.data.month);
      // console.log("processData中的数据是：",recordData);
      // 代表整个月的数组
      var infor = [];
      // if (!this.data.infor){
      //   infor = this.data.infor;
      // }

      
      var week = '';
      // var dateArr = recordData.recordDate.split("-");
      var year = Number(this.data.year);
      var month = Number(this.data.month);
      
      // 判断 所选月的数据是否为空
      if(recordData){
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
          // if (!this.data.infor && !this.data.infor[i].num){
          //   num = this.data.infor[i].num;
          // }

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
            // 判断是 收入 还是 支出
            if (recordData[i].data[j].isActive) {
              pay = recordData[i].data[j].recordMoney;
            }
            else {
              gain = recordData[i].data[j].recordMoney;
            }
            // 收入/支出 的 类型
            var content = recordData[i].data[j].recordContent + "(" + recordData[i].data[j].recordRemark + ")";
            // console.log(content);
            // console.log(num);

            // 把得到的 某一天 的 某条数据 push 到 num 数组中
            numObj.content = content;
            // console.log(content);
            numObj.gain = gain;
            numObj.pay = pay;
            num.push(numObj);
            // console.log(num);

          }

          // console.log(num);

          // 把得到的 当前月 的 所有天 的 所有数据 push 到 infor 数组中
          inforObj.date = date;
          inforObj.week = week;
          inforObj.num = num;
          infor.push(inforObj);

        }
      }

      this.setData({
        mIncome: 0,
        mExpend: 0,
        mSurplus: 0,
        infor: infor
      })
      
      // console.log(this.data.infor);
    }
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

    var data = wx.getStorageSync("recordJson");
    // console.log("onshow缓存中的数据是：" ,data);

    this.processData(data);
    // console.log(this.data.infor);

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

  }
})