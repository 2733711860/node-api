/*
* 风雨小说网PC端
* 爬取书籍
* 参数：start：开始页数
* end：结束页数
* */

const async = require('async');
const path = require('path');
const uuid = require("uuid");
const fs = require("fs");
const func = require("../../module/picture/qiniu-upload");

let base_path = path.join(__dirname, '../../picture');

module.exports = {
  crawlPicture() {
    return new Promise(async (resolve, reject) => {
      try {
        let files = fs.readdirSync(base_path);
        itemFile(files).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '保存成功'
          })
        })
      } catch (e) {
        let result = {
          status: 500,
          data: e,
          msg: "爬取数据出错"
        };
        resolve(result)
      }
    })
  }
};

function itemFile(files) {
  return new Promise(((resolve, reject) => {
    async.mapLimit(files, 10, (item, callback) => {
      getFYBookItem(item, callback); // 小说列表每页url列表获取所有小说信息
    }, (err, results) => {
      if (err) reject(err);
      resolve(results)
    });
  }))
}

async function getFYBookItem(filePath, callback) {
  let file_path = base_path + '/' + filePath; // 完整文件名
  // 创建文件可读流
  const reader = fs.createReadStream(file_path);
  // 命名文件
  const fileName = uuid.v1();
  // 获取上传文件扩展名
  const ext = filePath.split(".").pop();
  // 命名文件以及拓展名
  const fileUrl = `${fileName}.${ext}`;
  // 调用方法(封装在utils文件夹内)
  const result = await func.upToQiniu(reader, fileUrl);
  callback(null, result);
}


