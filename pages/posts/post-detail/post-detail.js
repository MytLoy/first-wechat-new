var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({
  data: {
    isPlayingMusic: false,
    collected: false,
  },
  // 初始化函数
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = options.id;
    var postData = postsData.postList[postId];
    this.setData(
      {
        postData: postData,
      },
    );
    // 缓存 是否收藏
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      if (postsCollected[postId]) {
        var postCollected = postsCollected[postId];
        this.setData({
          collected: postCollected,
        });
      } else {
        postsCollected[postId] = false;
        wx.setStorageSync('posts_collected', postsCollected);
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    // 全局变量控制 进/退文章的音乐播放
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId) {
      this.setData({
        isPlayingMusic: true,
      });
    }

    // 监听音乐
    this.setMusicMonitor();
  },

  // 监听音乐
  setMusicMonitor:function(){
    var that = this;

    // 播放音乐
    wx.onBackgroundAudioPlay(function () {
      var pages = getCurrentPages(); // 获取当前页面
      var currentPage = pages[pages.length - 1];
      // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。
      // 通过页面栈拿到到当前页面的postid，只处理当前页面的音乐播放。
      if (currentPage.data.currentPostId === that.data.currentPostId){
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId){
          that.setData({
            isPlayingMusic: true,
          });
        }
      }
      app.globalData.g_isPlayingMusic = true;
      // app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });

    // 暂停播放
    wx.onBackgroundAudioPause(function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isPlayingMusic: false,
          });
        }
      }
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });

    // 音乐播放结束恢复成未播放
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });

  },

  onCollectTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 取反
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected,
          });
        }
      },
    });
  },

  showToast: function (postsCollected, postCollected) {
    // 更新是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定，从而实现切换图片
    this.setData({
      collected: postCollected,
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
    });
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        wx.showModal({
          title: '用户分享到' + itemList[res.tapIndex],
          content: "用户是否取消？" +  "现在无法实现分享功能，什么时候能支持呢",
        })
      }
    });
  },

  // 点击音乐图标
  onMusicTap:function(event){
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false,
      });
      app.globalData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData[currentPostId].music.url,
        title: postData[currentPostId].music.title,
        coverImgUrl: postData[currentPostId].music.coverImg,
      });
      this.setData({
        isPlayingMusic: true,
      });
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true;
    }
    
  },

})