/**
 * @description: 保存爬取的每日一语信息到数据库
 * @author: mwd
 * @param:
 * @date: 2021/1/29
 */
const { addData, findData } = require('../../util/mysql/mysql');

const saveEveryDayWord = async (data) => {
  return new Promise(async (resolve, reject) => {
    // 创建每日一语表
    let createSql = `create table if not exists everydayWord(
      id varchar(255),
      nowDate date,
      word longtext,
      coverImage varchar(255),
      primary key (id)
    )charset=utf8`;
    await addData(createSql);

    let searchSql = `select id from everydayWord where id = ${data.id}`;
    let searchResult = await findData(searchSql);
    if (searchResult.length == 0) {
      let insertSql = `insert into everydayWord set ?`;
      await addData(insertSql, data).then(res => {
        resolve(res);
      }).catch(err => {
        reject('保存出错')
      })
    } else {
      reject('今天已经保存过')
    }
  })
};

module.exports = {
  saveEveryDayWord
};
