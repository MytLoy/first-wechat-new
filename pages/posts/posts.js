var postData = require('../../data/posts-data.js');

Page({

  /**
   * 页面的初始数据 单项数据绑定；反向数据传递：通过事件触发
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载 向服务器请求数据
   */
  onLoad: function (options) {
    // this.data.listData = postData.postList; // 异步操作直接复制无效
    this.setData({
      listData: postData.postList
    }); // 数组也要写成对象的模式
  },

  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    });
  },

  onSwiperTap:function(event){
    // target：指的是当前点击的组件
    // currentTarget：指的是事件捕获的组件(挂载组件)
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    });
  },

})