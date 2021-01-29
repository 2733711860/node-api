const { getTopLists: api_qq_getTopLists } = require('../../../module');
const { commonParams } = require('../../../config/qq-request-config');

module.exports = async (ctx, next) => {
	const props = {
		method: 'get',
		params: commonParams,
		option: {},
	};
	const { status, body } = await api_qq_getTopLists(props);
	Object.assign(ctx, {
		status,
		body,
	});
};
