const Koa = require('koa');
const app = new Koa();
const koabodyparser = require('koa-body');
app.use(koabodyparser({
  multipart: true // 是否支持 multipart-formdate 的表单
}));

require('./util/qqRequest/colors');

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`.prompt);
});

const cors = require('koa2-cors');
app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    return '*'; //只允许http://localhost:8080这个域名的请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

const router = require('./router/router');
app.use(router.routes(), router.allowedMethods(), (err)=> {
  console.log(err)
});

const { listenPort, listenHost } = require('./config/config');
app.listen(listenPort, listenHost, () => {
  console.log(`http://${listenHost}:${listenPort}`)
});


