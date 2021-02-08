/**
 * @description: 获取诗词类型列表
 * @author: mwd
 * @param:
 * @date: 2021/2/8
 */
const { findData } = require('../../../util/mysql/mysql');

module.exports = (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let searchSql = `select type from poetry`;
      let result = await findData(searchSql);
      resolve({
        status: 200,
        data: {
          list: result
        },
        msg: '查询成功'
      })
    } catch (e) {
      resolve({
        status: 400,
        data: e,
        msg: '服务器异常'
      })
    }
  })
};
