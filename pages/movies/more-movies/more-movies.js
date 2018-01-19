var util = require('../../../utils/util.js');

Page({

  data: {
    BarTitle: '',
    news: null,
  },

  // onload 初始化不应该操作ui
  onLoad: function (options) {
    console.log(options.category);
    this.setData({
      BarTitle: options.category,
    });
    var url = 'https://way.jd.com/jisuapi/get?appkey=857050353b6724ea86cd9b3539f0e408&channel=' + this.data.BarTitle;
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
  processNewData:function(res){
    var news = [];
    var dataList = res.result.result.list;
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
        id: i,
        newImage: image,
        newTitle: title,
        newTime: dataList[i].time,
        num: starNum.toFixed(1),
        star: util.convertToStarsArray(Math.floor(starNum)), // 向下取整
      }
      news.push(a);
    }
    this.setData({
      news: news,
    });
    console.log(news);
  },

})