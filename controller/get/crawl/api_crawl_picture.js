/**
 * @description: 爬取百度图片
 * @author: mwd
 * @param:
 * @date: 2021/1/28
 */
const { crawlPicture } = require('../../../module/picture/crawl-picture');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    crawlPicture().then(res => {
      resolve(res)
    })
  });
};
