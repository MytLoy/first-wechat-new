var util = require('../../../utils/util.js');

Page({

  data: {
    BarTitle: '',
    news: null,
    requestUrl: null,
    totalCount: null,
    isEmpty: true,
  },

  // onload 初始化不应该操作ui
  onLoad: function (options) {
    console.log(options.category);
    this.setData({
      BarTitle: options.category,
    });
    var url = 'https://way.jd.com/jisuapi/get?appkey=857050353b6724ea86cd9b3539f0e408&channel=' + this.data.BarTitle;
    this.data.requestUrl = url;
    // 请求数据
    util.http(url, this.processNewData);
  },

  // 页面已经渲染完成
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.BarTitle,
    });
  },

  // 处理数据
  processNewData: function (res) {
    var news = [];
    var dataList = res.result.result.list;
    for (var i = 0; i < dataList.length; i++) {
      // 标题
      var title = dataList[i].title;
      if (title.length > 6) {
        title = dataList[i].title.substring(0, 6) + '...';
      }
      // 图片
      var image = dataList[i].pic;
      if (!image) {
        image = '/images/bg/bj01.jpg';
      }
      // 随机生成星星分数 向下取整
      var starNum = Math.random() * 5;
      var a = {
        id: i,
        newImage: image,
        newTitle: title,
        newTime: dataList[i].time,
        num: starNum.toFixed(1),
        star: util.convertToStarsArray(Math.floor(starNum)), // 向下取整
      }
      news.push(a);
    }

    var totalNews = {};
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalNews = this.data.news.concat(news);
    } else {
      totalNews = news;
      this.data.isEmpty = false;
    }
    this.setData({
      news: totalNews,
    });
    this.data.totalCount += 10;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  // 下滑加载更多
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "&start=" + this.data.totalCount + "&num=10";
    util.http(nextUrl, this.processNewData);
    wx.showNavigationBarLoading();
  },

  // 下拉组件自动调用
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "&star=0&num=10";
    // 下拉需要恢复初始化
    this.data.news = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processNewData);
    wx.showNavigationBarLoading();
  },

})