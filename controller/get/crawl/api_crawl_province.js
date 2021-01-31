/**
 * @description: 获取省市区
 * @author: mwd
 * @param:
 * @date: 2021/1/30
 */
const request = require("request");
const cheerio = require("cheerio");
const async = require('async');
const uuid = require("uuid");
const { addData } = require('../../../util/mysql/mysql');
const greetingURL = 'https://tianqi.moji.com/weather/china';

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    getProvince().then(provinceRes => {
      async.mapLimit(provinceRes, 3, (item, callback) => {
        getCity(item, callback);
      }, (err, results) => {
        if (err) {
          resolve({
            status: 400,
            data: err,
            msg: '市区获取失败'
          })
        };
        let list = results.filter(item => item != undefined);
        getOtherArea(list).then(otherRes => {
          resolve({
            status: 200,
            data: otherRes,
            msg: '港澳台获取成功'
          })
        }).catch(err => {
          resolve({
            status: 400,
            data: err,
            msg: '港澳台获取失败'
          })
        })
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '省获取失败'
      })
    })
  })
};

// 获取省
async function getProvince() {
  return new Promise((resolve, reject) => {
    request(greetingURL, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(res.body.toString());
        let provinceList = [];
        $('.city .city_list').each((i, v) => {
          $(v).find('dd ul li').each((ii, vv) => {
            let oneProvince = {
              provinceName: $(vv).find('a').text(),
              provinceUrl: `https://tianqi.moji.com/${$(vv).find('a').attr('href')}`,
              provinceInitials: $(v).find('dt').text(),
              cityList: []
            };
            provinceList.push(oneProvince);
          })
        });
        resolve(provinceList);
      } else {
        reject('获取省失败！')
      }
    })
  })
};

// 获取市区
async function getCity(item, callback) {
  try {
    request(item.provinceUrl, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(res.body.toString());
        $('.city .city_hot ul li').each((i, v) => {
          let oneCity = {
            cityName: $(v).find('a').text(),
            cityUrl: $(v).find('a').attr('href')
          };
          item.cityList.push(oneCity);
        });
        callback(null, item);
      } else {
        console.log(`${item.provinceName}获取失败`)
        callback(null)
      }
    })
  } catch (e) {
    callback(null)
  }
}

async function getOtherArea(list) {
  return new Promise((resolve, reject) => {
    let linkList = [
      {
        name: '香港',
        initials: 'X',
        link: 'https://tianqi.moji.com/api/citysearch/%E9%A6%99%E6%B8%AF'
      }, {
        name: '澳门',
        initials: 'A',
        link: 'https://tianqi.moji.com/api/citysearch/%E6%BE%B3%E9%97%A8'
      }, {
        name: '台湾',
        initials: 'T',
        link: 'https://tianqi.moji.com/api/citysearch/%E5%8F%B0%E6%B9%BE'
      }
    ];
    async.mapLimit(linkList, 3, (item, callback) => {
      request(item.link, (error, res, body) => {
        if (!error && res.statusCode == 200) {
          let taiwanCityList = JSON.parse(res.body).city_list.map(item => {
            return {
              cityName: item.name,
              cityUrl: ''
            }
          });
          let taiWanObj = {
            provinceName: item.name,
            provinceUrl: '',
            provinceInitials: item.initials,
            cityList: taiwanCityList
          };
          callback(null, taiWanObj);
        } else {
          callback(null)
        }
      })
    }, (err, results) => {
      if (err) reject(err);
      let areaList = [...list, ...results];
      resolve(areaList);
    })
  })
}
