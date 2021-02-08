const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const request = require('../util/qqRequest/request');
const controller = require('../controller/post');

router.get('/', async (ctx, next) => {
  ctx.body = "hello world! create by pawn! my blog => http://blog.lcylove.cn"
});

let base_path = path.join(__dirname, '../controller');
requireRouters(base_path);

// get方法
function requireRouters(base_path) {
  let files = fs.readdirSync(base_path);
  files.forEach(file => {
    let file_name = base_path + '/' + file; // 完整文件名
    if (fs.statSync(file_name).isFile() && path.extname(file_name)==='.js') {
      let route = '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
      let question = require(file_name);
      router.get(route, async (ctx) => {
        console.log(ctx.query);
        let result = await question(ctx, request);
        ctx.body = result
      });
    } else {
      requireRouters(file_name)
    }
  })
}

// post
router.post('/api/upload/picture', controller.uploadPicture); // 图片上传
router.post('/api/add/route', controller.addRoute); // 新增路由
router.post('/api/get/route', controller.getRoute); // 获取路由

module.exports = router;
