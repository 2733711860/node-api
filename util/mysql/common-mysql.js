/**
 * @description: mysql操作
 * @author:
 * @param:
 * @date: 2021/2/2
 */
const { addData } = require('../../util/mysql/mysql');

// 添加，修改
async function addEditData(list, tableName) {
  return new Promise(async (resolve, reject) => {
    let keysList = Object.keys(list[0]);
    let str1 = keysList.join(',');
    let updates = keysList.map(item => {
      return `${item} = values(${item})`
    });
    updates = updates.join(',');
    let valueList = list.map(item => {
      return Object.values(item)
    });

    let editSql = `insert into ${tableName} (${str1}) values ? on duplicate key update ${updates}`;
    await addData(editSql, [valueList]).then(data => {
      resolve(data)
    }, (err) => {
      reject(err)
    });
  })
}

module.exports = {
  addEditData
};
