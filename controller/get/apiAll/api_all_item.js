/**
 * @description: 公共api调用分发
 * @author: mwd
 * @param: apiCode
 * @date: 2021/1/30
 */
const axios = require('axios');
const { apiList } = require('../../../util/apiAll/index');

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    let params = ctx.query;
    let apiObj = apiList.find(item => item.apiCode == params.apiCode);
    if (!apiObj) {
      resolve({
        status: 400,
        data: null,
        msg: `没有找到${apiCode}对应的api`
      });
      return;
    }
    let keysList = Object.keys(params);
    let list = keysList.map(item => {
      if (isChinese(params[item])) {
        return `${item}=${encodeURI(params[item])}`;
      } else {
        return `${item}=${params[item]}`;
      }
    });
    let str = list.join('&');
    apiObj.apiUrl = `${apiObj.apiUrl}?${str}`;
    axios.get(apiObj.apiUrl)
    .then(res => {
      console.log(res)
      resolve(res.data)
    })
    .catch(error => {
      console.log(error)
      resolve({
        status: 400,
        data: error,
        msg: '调用失败'
      })
    });
  })
}

// 判断是否是汉字
function isChinese(s) {
  var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  if (!patrn.exec(s)) {
    return false;
  } else {
    return true;
  }
}