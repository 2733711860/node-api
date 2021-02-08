/**
 * @description: 猫
 * @author: mwd
 * @param:
 * @date: 2021/2/7
 */
const { addData } = require("../../../util/mysql/mysql");

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    saveToMysql().then(res => {
      resolve({
        status: 200,
        data: res,
        msg: '成功'
      })
    })
  })
};

async function saveToMysql() {
  return new Promise(async (resolve, reject) => {
    // 创建表
    let createSql = `create table if not exists animal_cat(
      id varchar(255),
      cnName varchar(255) COMMENT '中文名',
      enName varchar(255) COMMENT '英文名',
      alias varchar(255) COMMENT '别名',
      distributionArea varchar(255) COMMENT '分布区域',
      originArea varchar(255) COMMENT '原产地',
      life varchar(255) COMMENT '寿命',
      fillIll varchar(255) COMMENT '易患病',
      introduction longtext COMMENT '简介',
      history longtext COMMENT '历史发展',
      features longtext COMMENT '形态特征',
      personality longtext COMMENT '性格特征',
      foodTaboos longtext COMMENT '饮食禁忌',
      pictures varchar(255) COMMENT '图片列表',
      link varchar(255) COMMENT '链接地址',
      primary key (id)
    )charset=utf8mb4`;
    addData(createSql).then(res => {
      resolve(res)
    });
  })
}
// character varchar(255) COMMENT '性格特征',
