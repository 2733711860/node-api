/**
 * @description: 新建备忘录
 * @author: 86183
 * @param:
 * @date: 2021/1/29
 */
const uuid = require("uuid");
const { addData } = require('../../../util/mysql/mysql');

module.exports = {
  async createMemorandum(ctx, next) {
    try {
    } catch (err) {
      ctx.body = {
        status: 400,
        data: null,
        msg: '错误'
      };
    }
  }
};

// 新建备忘录到数据库
async function saveNewMemorandum() {
  return new Promise(async(resolve, reject) => {
    // 创建表
    let createSql = `create table if not exists memorandum(
      id varchar(255),
      createTime time not null,
      title varchar(255),
      content longtext,
      tag varchar(255),
      images varchar(1000),
      primary key (id)
    )charset=utf8`;
    await addData(createSql);
  })
}

