/**
 * @description: 开放api列表
 * @author: mwd
 * @param:
 * @date: 2021/1/30
 */
const apiList = [
  { apiName: '随机文章', apiCode: '1', apiUrl: 'https://data.zhai78.com/openArticleRand.php' }, // get
  { apiName: '银行卡归属地卡片详情信息查询', apiCode: '2', apiUrl: 'https://data.zhai78.com/openBankCard.php' }, // get，参数num：银行卡号
  { apiName: '身份证信息查询', apiCode: '3', apiUrl: 'https://api.tx7.co/api/idcard' }, // get，参数 number：身份证号
  { apiName: '手机号码归属地及吉凶查询', apiCode: '4', apiUrl: 'https://data.zhai78.com/openTel.php' }, // get，参数tel：手机号码
  { apiName: '随机返回一句毒鸡汤', apiCode: '5', apiUrl: 'https://data.zhai78.com/openOneBad.php' }, // get
  { apiName: '随机返回一句鸡汤正能量', apiCode: '6', apiUrl: 'https://data.zhai78.com/openOneGood.php' }, // get
  { apiName: '根据 qq 号码获取头像昵称', apiCode: '7', apiUrl: 'https://data.zhai78.com/openQqDetail.php' }, // get，参数qq： qq 号
  { apiName: '随机一句一言', apiCode: '8', apiUrl: 'https://api.tx7.co/api/Aword' }, // get
  { apiName: '万能中文翻译', apiCode: '9', apiUrl: 'https://api.tx7.co/api/translation' }, // get，参数 text：内容
  { apiName: '搜狗表情包斗图', apiCode: '10', apiUrl: 'https://api.tx7.co/api/sgimg' }, // get，参数 text：内容
  { apiName: '腾讯Ai智能问答', apiCode: '11', apiUrl: 'https://api.tx7.co/api/txai' }, // get，参数 text：内容
  { apiName: '获取当前时间日期', apiCode: '12', apiUrl: 'https://api.tx7.co/api/Timedate' }, // get
  { apiName: '实况天气', apiCode: '13', apiUrl: 'https://tianqiapi.com/api' }, // get，参数 appid：用户appid；appsecret：用户appsecret；version：固定值: v6；cityid：城市ID；city：城市名称；ip：ip；vue：如果您使用的是react、vue、angular请填写值: 1
  { apiName: '七日天气', apiCode: '14', apiUrl: 'https://tianqiapi.com/api' }, // get，参数 appid：用户appid；appsecret：用户appsecret；version：固定值: v1；cityid：城市ID；city：城市名称；ip：ip；vue：如果您使用的是react、vue、angular请填写值: 1
  { apiName: '全国天气降水量预报图', apiCode: '15', apiUrl: 'https://tianqiapi.com/api' }, // get，参数 appid：用户appid；appsecret：用户appsecret；version：固定值: v8；vue：如果您使用的是react、vue、angular请填写值: 1
  // { apiName: '语音合成(文字转语音)', apiCode: '16', apiUrl: 'https://api.mlwei.com/tts/api/' }, // 直接拼接在html语音标签里 get，参数 text：内容；per：发音人选择；spd：语速，取值0-15，默认为5中语速；pit：音调，取值0-15，默认为5中语调；vol：音量，取值0-9，默认为5中音量
  { apiName: '获取诗词列表', apiCode: '17', apiUrl: 'http://poetry.apiopen.top/poetryFull' }, // get，参数 page：页码；count：每页多少条
  { apiName: '获取诗词作者列表', apiCode: '18', apiUrl: 'http://poetry.apiopen.top/poetryAuthor' }, // get，参数 page：页码；count：每页多少条；name：搜索名称（选填）
  { apiName: '腾讯天气', apiCode: '19', apiUrl: 'https://wis.qq.com/weather/common' }, // get，参数 source：xw；weather_type：forecast_1h|forecast_24h|index|alarm|limit|tips；province；city；county
  { apiName: '成语接龙', apiCode: '9', apiUrl: 'http://apis.juhe.cn/idiomJie/query' }, // get，参数 https://www.juhe.cn/docs/api/id/565
];

module.exports = {
  apiList
};

// 语音合成(文字转语音)：
// text=文字(支持中英文)，
// per=发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为0普通女声，
// spd=语速，取值0-15，默认为5中语速，
// pit=音调，取值0-15，默认为5中语调，
// vol=音量，取值0-9，默认为5中音量

// 腾讯天气:
//   source：xw
//   weather_type：forecast_1h|forecast_24h|index|alarm|limit|tips
// province：四川（必填）
// city：成都（必填）
// county：武侯区（选填）
