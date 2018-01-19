// 将分数转成类似3 -> [1,1,1,0,0]
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

// 请求数据
function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': '' // 默认值
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  });
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
}
