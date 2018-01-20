var util = require('../../utils/util.js');

Page({

  data: {
    headLine: {},
    science: {},
    Finance: {},
    searchResult: {},
    containerShow: true, // 三种新闻栏目
    searchPanelShow: false, // 搜索页面
  },

  onLoad: function (event) {
    var jisuapi = 'https://way.jd.com/jisuapi/get?num=3&channel=';
    var headLineUrl = jisuapi + '头条';
    var scienceUrl = jisuapi + '科技';
    var FinanceUrl = jisuapi + '财经';

    this.getNewListsData(headLineUrl, "headLine", '头条');
    this.getNewListsData(scienceUrl, "science", '科技');
    this.getNewListsData(FinanceUrl, "Finance", '财经');

  },

  // 请求数据
  getNewListsData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': '' // 默认值
      },
      data: {
        appkey: '857050353b6724ea86cd9b3539f0e408', // 申请的APPKEY
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
        id: settedKey + i,
        newImage: image,
        newTitle: title,
        newTime: dataList[i].time,
        num: starNum.toFixed(1),
        star: util.convertToStarsArray(Math.floor(starNum)), // 向下取整
        content: dataList[i].content,
        allTitle: dataList[i].title,
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
  },

  // onBindFocus
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    });
  },

  // 关闭搜索
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}, // 清空上次搜索内容
    });
  },

  // 点击搜索
  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = "https://way.jd.com/jisuapi/newSearch?keyword=" + text;
    this.getNewListsData(searchUrl, "searchResult", "");
  },

  // 跳转到详情页面
  // 因为调用的免费api没有根据id查某篇新闻的接口，就先在本地存了起来
  onNewsTap: function (event) {
    var newsId = event.currentTarget.dataset.newsId;
    var newsItem = {}
    newsItem = {
      title: event.currentTarget.dataset.allTitle,
      img: event.currentTarget.dataset.newImg,
      content: event.currentTarget.dataset.newContent,
    }
    wx.setStorageSync('newsItem', newsItem);
    wx.navigateTo({
      url: "movie-detail/movie-detail"
    });
  }

})