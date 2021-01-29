/**
 * @description: 获取每日一句; http://wufazhuce.com/
 * @author: mwd
 * @param:
 * @date: 2021/1/29
 */
const request = require("request");
const cheerio = require("cheerio");
const uuid = require("uuid");
const moment = require('moment');
const { saveEveryDayWord } = require('../../../module/crawl/crawl-everyday-word');
const greetingURL = 'http://wufazhuce.com/';

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    getEveryWordList().then(res => {
      saveEveryDayWord(res).then(result => {
        resolve({
          status: 200,
          data: res,
          msg: '成功'
        })
      }).catch(errs => {
        resolve({
          status: 400,
          data: err,
          msg: '失败'
        })
      });
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '失败'
      })
    })
  });
};

// 获取每日问候列表
async function getEveryWordList() {
  return new Promise((resolve, reject) => {
    request(greetingURL, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(res.body.toString());
        let everyDayWordsList = [];
        let everyDayImgList = [];
        $('div .fp-one-cita a').each((i, v) => {
          if ($(v).text()) {
            everyDayWordsList.push($(v).text().trim());
          }
        });
        $('.carousel-inner .item .fp-one-imagen').each((i, v) => {
          everyDayImgList.push($(v).attr('src'));
        });
        if (everyDayWordsList.length > 0) {
          let thisDay = {
            id: moment().format('yyyy-MM-DD'),
            nowDate: new Date(),
            word: everyDayWordsList[0],
            coverImage: everyDayImgList[0]
          };
          resolve(thisDay)
        } else {
          reject('网络错误，获取每日问候失败！')
        }
      } else {
        reject('网络错误，获取每日问候失败！')
      }
    })
  })
}
