Page({
  onTap: function(){
    // 从父级跳转到子级 最多只有5级 新窗口打开页面
    wx.navigateTo({
      url: '../posts/posts',
    });

    // 原窗口打开页面
    // wx.redirectTo({
    //   url: '../posts/posts',
    // });
  }
})