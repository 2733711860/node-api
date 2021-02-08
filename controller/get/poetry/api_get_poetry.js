/**
 * @description: 根据关键词搜索诗词（作者、诗词名、诗词内容都可）
 * @author: mwd
 * @param: { page: '页码', pageSize: '每页数量', keyWord: '查询关键字' }
 * @date: 2021/2/8
 */
// dynasty: {
//   先秦:   1
//   两汉:   2
//   魏晋:   3
//   隋代:   4
//   唐代:  5
//   南北朝: 6
//   宋代: 7
//   五代: 8
//   金朝: 9
//   元代: 10
//   明代: 11
//   清代: 12
//   近现代: 13
//   其他: 14
// }

const { findData } = require('../../../util/mysql/mysql');

module.exports = (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        page = 1,
        pageSize = 10,
        keyWord = '',
      } = ctx.query;
      page = Number(page);
      pageSize = Number(pageSize);

      if (page < 1 || pageSize < 1) {
        resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }

      let searchSql = `select sql_calc_found_rows * from poetry where 
        ((instr(name, '${keyWord}') > 0) or (instr(author, '${keyWord}') > 0) or (instr(content, '${keyWord}') > 0)) 
        order by id asc limit ${(page-1) * (pageSize)}, ${pageSize}`;
      let result = await findData(searchSql);
      let total = await findData(`SELECT FOUND_ROWS() as total;`);
      resolve({
        status: 200,
        data: {
          list: result,
          total: total[0].total
        },
        msg: '查询成功'
      })
    } catch (e) {
      resolve({
        status: 400,
        data: e,
        msg: '服务器异常'
      })
    }
  })
};
