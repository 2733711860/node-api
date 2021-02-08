/**
 * @description: 七日天气接口
 * @author: 86183
 * @param: version: v6：实况天气；v1：七日天气；v8：全国降水量图
 * @param: city：城市名称，不要带市和区
 * @param: cityId：城市ID
 * @date: 2021/2/4
 */

const axios = require('axios');

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let params = Object.assign(ctx.query, {
        appid: '26724689',
        appsecret: 'eOc2Zbnn',
        version: ctx.query.version || 'v9'
      });
      let keysList = Object.keys(params);
      let list = keysList.map(item => {
        if (isChinese(params[item])) {
          return `${item}=${encodeURI(params[item])}`;
        } else {
          return `${item}=${params[item]}`;
        }
      });
      let str = list.join('&');
      let apiUrl = `https://v0.yiketianqi.com/api?${str}`;
      console.log(apiUrl);
      axios.get(apiUrl)
        .then(res => {
          resolve({
            status: 200,
            data: res.data,
            msg: '成功'
          })
        })
        .catch(error => {
          resolve({
            status: 400,
            data: null,
            msg: '调用失败'
          })
        });
    } catch (e) {
      resolve({
        status: 400,
        data: e,
        msg: '调用失败'
      })
    }
  })
};

// 判断是否是汉字
function isChinese(s) {
  var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  if (!patrn.exec(s)) {
    return false;
  } else {
    return true;
  }
}

