var util = require('../../../utils/util.js');

Page({

  data: {
    title: null,
    img: null,
    content: null,
  },
  onLoad: function (options) {
    var newsItem = wx.getStorageSync('newsItem');
    this.setData({
      title: newsItem.title,
      img: newsItem.img,
      content: util.changeHtml(newsItem.content),
      time: newsItem.time,
    });
  },
})