/**
 * @description: 获取路由
 * @author: mwd
 * @param:
 * @date: 2021/2/2
 */
const { findData } = require('../../../util/mysql/mysql');

module.exports = {
  async getRoute(ctx, next) {
    let {
      tableName = 'vueRouteTable'
    } = ctx.request.body;

    // 判断是否存在表
    let isLiveTable = `SHOW TABLES LIKE '%${tableName}%'`;
    await findData(isLiveTable).then(async liveRes => {
      if (liveRes && liveRes.length > 0) {
        let searchSql = `select * from ${tableName}`;
        await findData(searchSql).then(res => {
          ctx.body = {
            status: 200,
            data: res,
            msg: '成功'
          }
        }).catch(err => {
          ctx.body = {
            status: 400,
            data: err,
            msg: '失败'
          }
        })
      } else {
        ctx.body = {
          status: 200,
          data: [],
          msg: '成功'
        }
      }
    });
  }
};
