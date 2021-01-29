const { getSingerStarNum: api_qq_getSingerStarNum } = require('../../../module');

module.exports = async (ctx, next) => {
	const { singermid } = ctx.query;
	const props = {
		method: 'get',
		params: {
			singermid,
		},
		option: {},
	};
	if (singermid) {
		const { status, body } = await api_qq_getSingerStarNum(props);
		Object.assign(ctx, {
			status,
			body,
		});
	} else {
		ctx.status = 400;
		ctx.body = {
			response: 'no singermid',
		};
	}
};
