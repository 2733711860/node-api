/**
 * @description: 新增路由
 * @author: mwd
 * @param:
 * @date: 2021/2/2
 */
const { addData } = require('../../../util/mysql/mysql');
const { addEditData } = require('../../../util/mysql/common-mysql');

module.exports = {
  async addRoute(ctx, next) {
    let routeList = ctx.request.body;
    await saveRoute(routeList).then(async res => {
      ctx.body = {
        status: 200,
        data: res,
        msg: '成功'
      }
    }).catch(err => {
      ctx.body = {
        status: 400,
        data: err,
        msg: '错误'
      }
    })
  }
};

async function saveRoute(routeList) {
  return new Promise(async (resolve, reject) => {
    // 创建表
    let createSql = `create table if not exists vueRouteTable(
      name varchar(255),
      path varchar(255) not null,
      component varchar(255),
      primary key (path)
    )charset=utf8`;
    await addData(createSql);

    await addEditData(routeList, 'vueRouteTable').then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
