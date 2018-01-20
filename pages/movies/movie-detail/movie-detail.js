// pages/movies/movie-detail/movie-detail.js
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
      content: newsItem.content,
    });
    console.log(newsItem);
  },
})