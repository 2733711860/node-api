/**
 * @description: 上传图片到七牛云
 * @author: mwd
 * @param:
 * @date: 2021/1/28
 * http://qnmfzc41w.hn-bkt.clouddn.com/mwd-picture-1.jpg
 */
// 为文件进行命名（唯一标识）
const uuid = require("uuid");
const fs = require("fs");
// func是封装的上传图片到七牛云代码
const func = require("../../../module/picture/qiniu-upload");

module.exports = {
  async uploadPicture(ctx, next) {
    try {
      // 前端必须以formData格式进行文件的传递
      const file = ctx.request.files.file; // 获取上传文件
      if (file) {
        // 命名文件
        const fileName = uuid.v1();
        // 创建文件可读流
        const reader = fs.createReadStream(file.path);
        // 获取上传文件扩展名
        const ext = file.name.split(".").pop();
        // 命名文件以及拓展名
        const fileUrl = `${fileName}.${ext}`;
        // 调用方法(封装在utils文件夹内)
        const result = await func.upToQiniu(reader, fileUrl);
        if (result) {
          ctx.body = {
            status: 200,
            data: result,
            msg: '上传成功'
          };
        } else {
          ctx.body = {
            status: 400,
            data: null,
            msg: '上传失败'
          };
        }
      } else {
        ctx.body = {
          status: 400,
          data: null,
          msg: '没有选择图片'
        };
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        status: 400,
        data: null,
        msg: '错误'
      };
    }
  }
};
