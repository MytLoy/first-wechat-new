var util = require('../../utils/util.js');

Page({

  data: {
    headLine: {},
    science: {},
    Finance: {},
  },

  onLoad: function (event) {
    var headLineChannel = '头条';
    var scienceChannel = '科技';
    var FinanceChannel = '财经';

    this.getNewListsData(headLineChannel, "headLine", '头条');
    this.getNewListsData(scienceChannel, "science", '科技');
    this.getNewListsData(FinanceChannel, "Finance", '财经');

  },

  // 请求数据
  getNewListsData: function (channel, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: 'https://way.jd.com/jisuapi/get',
      method: 'GET',
      header: {
        'Content-Type': '' // 默认值
      },
      data: {
        appkey: '857050353b6724ea86cd9b3539f0e408', // 申请的APPKEY
        channel: channel, // 新闻频道
        start: 0,
        num: 3,
      },
      success: function (res) {
        that.processNewData(res.data.result.result, settedKey, categoryTitle);
      }
    });
  },

  // 接受新闻首页数据并处理
  processNewData: function (data, settedKey, categoryTitle) {
    var news = [];
    var dataList = data.list;
    for (var i = 0; i < dataList.length; i++) {
      // 标题
      var title = dataList[i].title;
      if (title.length > 13) {
        title = dataList[i].title.substring(0, 13) + '...';
      }
      // 图片
      var image = dataList[i].pic;
      if (!image) {
        image = '/images/bg/bj01.jpg';
      }
      // 随机生成星星分数 向下取整
      var starNum = Math.random() * 5;
      var a = {
        id: settedKey + i,
        newImage: image,
        newTitle: title,
        newTime: dataList[i].time,
        num: starNum.toFixed(1),
        star: util.convertToStarsArray(Math.floor(starNum)), // 向下取整
      }
      news.push(a);
    }
    // 对应的数据
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      news: news,
    };
    this.setData(readyData);
  },

  // 点击更多
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + category,
    });
  }

})