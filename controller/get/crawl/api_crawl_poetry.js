/**
 * @description: 古诗词
 * @author: 86183
 * @param: spacialType: 1/2
 * @date: 2021/2/5
 */
const request = require("request");
const cheerio = require("cheerio");
const async = require('async');
const uuid = require("uuid");
const { addData } = require('../../../util/mysql/mysql');
const { addEditData } = require('../../../util/mysql/common-mysql');
const pinyin = require('pinyin');

const dynastyObj = {
  '〔先秦〕': 1,
  '〔两汉〕': 2,
  '〔魏晋〕': 3,
  '〔隋代〕': 4,
  '〔唐代〕': 5,
  '〔南北朝〕': 6,
  '〔宋代〕': 7,
  '〔五代〕': 8,
  '〔金朝〕': 9,
  '〔元代〕': 10,
  '〔明代〕': 11,
  '〔清代〕': 12,
  '〔近现代〕': 13,
  '〔未知〕': 14
};

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    let spacialType = ctx.query.spacialType ? ctx.query.spacialType : '2';

    getPoemTypes('https://so.gushiwen.cn/shiwens/').then($ => {
      let poemsTypes = [];
      $("#type1 .sright a").each((i, v) => {
        poemsTypes.push({
          name: $(v).text(),
          link: `https://so.gushiwen.cn/${$(v).attr('href')}`
        })
      });

      getDetailByTypes(poemsTypes, spacialType).then(res => {
        if (spacialType == '1') {
          getSpacialDetail(res).then(spaRes => {
            spaRes = spaRes.filter(iteFil => iteFil.content != '');
            saveToMysql(spaRes).then(saveRes => {
              resolve({
                status: 200,
                data: saveRes,
                msg: '诗文类别获取成功'
              })
            }).catch(err => {
              resolve({
                status: 400,
                data: err,
                msg: '诗文类别保存失败'
              })
            })
          }).catch(err => {
            resolve({
              status: 400,
              data: err,
              msg: '诗文类别获取失败'
            })
          })
        } else {
          saveToMysql(res).then(saveRes => {
            resolve({
              status: 200,
              data: saveRes,
              msg: '诗文类别获取成功'
            })
          }).catch(err => {
            resolve({
              status: 400,
              data: err,
              msg: '诗文类别保存失败'
            })
          })
        }
      }).catch(err => {
        resolve({
          status: 400,
          data: err,
          msg: '诗文类别获取失败'
        })
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '诗文类别获取失败'
      })
    })
  })
};

// 诗文类别
async function getPoemTypes(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(res.body.toString());
        resolve($);
      } else {
        reject('获取诗文类别失败！')
      }
    })
  })
};

let pageList = [];
// 根据类别找所有诗文
async function getDetailByTypes(poemsTypes, spacialType) {
  return new Promise((resolve, reject) => {
    async.mapLimit(poemsTypes, 5, (item, callback) => {
      getPoemTypes(item.link).then($ => {
        if ($("#FromPage").length > 0) { // 普通类别，有分页
          if (spacialType == '2') {
            pageList.push(`https://so.gushiwen.cn/${$("#FromPage .pagesright").children().eq(0).attr('href')}`);
            pageList = pageList.filter(item => item !=undefined);
            getPagePoetry(pageList, item).then(res => {
              callback(null, res);
            }).catch(err => {
              callback(null);
            })
          } else {
            callback(null);
          }
        } else {
          let poetryList = [];
          $(".left .sons .typecont").each((i, v) => {
            $(v).find('span').each((ii, vv) => {
              poetryList.push({
                firstType: '诗文',
                type: item.name,
                secondType: $(v).find('.bookMl strong').text() ? $(v).find('.bookMl strong').text() : item.name,
                name: $(vv).find('a').text(),
                link: `https://so.gushiwen.cn/${$(vv).find('a').attr('href')}`
              });
            })
          });
          if (spacialType == '1') {
            callback(null, poetryList);
          } else {
            callback(null);
          }
        }
      }).catch(err => {
        callback(null);
      })
    }, (err, results) => {
      if (err) reject(err);
      results = results.filter(item => item != undefined);
      let finalList = [];
      results.forEach(ites => {
        finalList.push(...ites)
      });
      resolve(finalList)
    })
  })
};

// 特殊诗词获取
async function getSpacialDetail(list) {
  return new Promise((resolve, reject) => {
    async.mapLimit(list, 20, (item, callback) => {
      getPoemTypes(item.link).then($ => {
        let poetryList = [];
        let author = $(".left .sons:first").find('.cont').children().eq(2).children().eq(0).text();
        let authorLinkStr = $(".left .sons:first").find('.cont').children().eq(2).children().eq(0).attr('href');
        let authorLink = authorLinkStr ? `https://so.gushiwen.cn/${authorLinkStr}` : '';
        let dynastyLinkStr = $(".left .sons:first").find('.cont').children().eq(2).children().eq(1).attr('href');
        let dynastyLink = dynastyLinkStr ? `https://so.gushiwen.cn/${dynastyLinkStr}` : '';
        let dynasty = $(".left .sons:first").find('.cont').children().eq(2).children().eq(1).text();
        let id = normalize(`${author}${item.name}`);
        poetryList.push({
          id: id,
          type: item.type,
          name: item.name,
          author: author,
          authorLink: authorLink,
          dynasty: dynastyObj[dynasty],
          dynastyLink: dynastyLink,
          content: $(".left .sons:first").find(".cont .contson").text()
        });
        callback(null, poetryList);
      }).catch(err => {
        callback(null);
      })
    }, (err, results) => {
      if (err) reject(err);
      results = results.filter(item => item != undefined);
      let finalList = [];
      results.forEach(ites => {
        finalList.push(...ites)
      });
      resolve(finalList)
    })
  })
};

// 有分页类型获取
async function getPagePoetry(list, one) {
  return new Promise((resolve, reject) => {
    async.mapLimit(list, 10, (item, callback) => {
      getPoemTypes(item).then($ => {
        let poetryList = [];
        $(".left .sons").each((i, v) => {
          let authorLinkStr = $(v).find('.cont').children().eq(2).children().eq(0).attr('href');
          let authorLink = authorLinkStr ? `https://so.gushiwen.cn/${authorLinkStr}` : '';
          let dynastyLinkStr = $(v).find('.cont').children().eq(2).children().eq(1).attr('href');
          let dynastyLink = dynastyLinkStr ? `https://so.gushiwen.cn/${dynastyLinkStr}` : '';
          let name = $(v).find('.cont').children().eq(1).find('a').text();
          let author = $(v).find('.cont').children().eq(2).children().eq(0).text();
          let dynasty = $(v).find('.cont').children().eq(2).children().eq(1).text();
          let id = normalize(`${author}${name}`);
          poetryList.push({
            id: id,
            type: one.name,
            name: name,
            author: author,
            authorLink: authorLink,
            dynasty: dynastyObj[dynasty],
            dynastyLink: dynastyLink,
            content: $(v).find(".cont .contson").text()
          })
        });
        callback(null, poetryList);
      }).catch(err => {
        callback(null);
      })
    }, (err, results) => {
      if (err) reject(err);
      results = results.filter(item => item != undefined);
      let finalList = [];
      results.forEach(ites => {
        finalList.push(...ites)
      });
      resolve(finalList)
    })
  })
}

// 保存到数据库
async function saveToMysql(list) {
  return new Promise(async (resolve, reject) => {
    // 创建表
    let createSql = `create table if not exists poetry(
      id varchar(255),
      firstType varchar(255),
      type varchar(255),
      secondType varchar(255),
      name varchar(255),
      author varchar(255),
      authorLink varchar(255),
      dynasty varchar(255),
      dynastyLink varchar(255),
      content longtext,
      primary key (id)
    )charset=utf8mb4`;
    await addData(createSql);

    await addEditData(list, 'poetry').then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
};

// 文字转拼音
function normalize(originalName){
  let zm = pinyin(originalName, { style: pinyin.STYLE_NORMAL }).toString();
  zm = zm.replace(new RegExp(",",'g'), "");
  return zm;
}


