/**
 * @description: 获取搜素热词
 * @author: mwd
 * @param: 无
 * @date: 2021/1/27
 */

const { getHotKey: api_qq_getHotkey } = require('../../../module');

module.exports = async (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    const props = {
      method: 'get',
      params: {},
      option: {},
    };
    const { status, body } = await api_qq_getHotkey(props);
    resolve(body)
  })
};
