/**
 * @description: 青年文摘杂志
 * @author: 86183
 * @param:
 * @date: 2021/1/29
 */
const request = require("request");
const cheerio = require("cheerio");
const async = require('async');
const uuid = require("uuid");
const { addData } = require('../../../util/mysql/mysql');
const greetingURL = 'https://liunianbanxia.com/2019-youth-digest-online-reading.html';

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    getWenZhaiArtical().then(list => {
      getWenZhaiContent(list).then(result => {
        let articalList = result.filter(item => item != undefined);
        if (articalList.length > 0) {
          saveArtical(articalList).then(saveRes => {
            resolve({
              status: 200,
              data: saveRes,
              msg: '成功'
            })
          }).catch(err => {
            resolve({
              status: 400,
              data: err,
              msg: '保存失败'
            })
          })
        } else {
          resolve({
            status: 400,
            data: err,
            msg: '获取失败'
          })
        }
      }).catch(err => {
        resolve({
          status: 400,
          data: err,
          msg: '获取失败'
        })
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '获取失败'
      })
    })
  })
};

// 获取青年文摘文章标题
async function getWenZhaiArtical() {
  return new Promise((resolve, reject) => {
    request(greetingURL, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let articalList = [];
        let $ = cheerio.load(res.body.toString());
        $('.content p').each((i, v) => {
          if ($(v).find('a').attr('href')) {
            let oneArtical = {
              title: $(v).find('a').text(),
              link: $(v).find('a').attr('href')
            };
            articalList.push(oneArtical);
          }
        });
        resolve(articalList)
      } else {
        reject('获取标题失败！')
      }
    })
  })
}

// 获取青年文摘文章正文
async function getWenZhaiContent(list) {
  return new Promise((resolve, reject) => {
    async.mapLimit(list, 10, (item, callback) => {
      getItemContent(item, callback);
    }, (err, results) => {
      if (err) reject(err);
      resolve(results)
    })
  })
}

// 获取每本书正文
async function getItemContent(item, callback) {
  try {
    request(item.link, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(res.body.toString());
        let thisArtical = {
          id: uuid.v1(),
          title: item.title ? item.title : '',
          image: $('.content p').find('img').attr('src') ? $('.content p').find('img').attr('src') : '',
          content: ''
        };
        let contentList = [];
        $('.content p').each((i, v) => {
          contentList.push($(v).text());
        });
        thisArtical.content = contentList.join('paragetostring') ? contentList.join('paragetostring') : ''; // 以paragetostring进行分割
        callback(null, thisArtical);
      } else {
        callback(null)
      }
    })
  } catch (e) {
    callback(null)
  }
}

// 保存文章
async function saveArtical(results) {
  return new Promise(async(resolve, reject) => {
    // 创建表
    let createSql = `create table if not exists artical_qingnianwenzhai(
      id varchar(500),
      title varchar(500),
      image varchar(500),
      content longtext,
      primary key (id)
    )charset=utf8`;
    await addData(createSql);

    let keysList = Object.keys(results[0]);
    let str1 = keysList.join(',');
    let updates = keysList.map(item => {
      return `${item} = values(${item})`
    });
    updates = updates.join(',');
    let valueList = results.map(item => {
      return Object.values(item)
    });

    let editSql = `insert into artical_qingnianwenzhai (${str1}) values ? on duplicate key update ${updates}`;
    await addData(editSql, [valueList]).then(data => {
      resolve(data)
    }, (err) => {
      reject(err)
    });
  })
}
