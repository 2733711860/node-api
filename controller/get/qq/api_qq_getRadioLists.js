const { getRadioLists: api_qq_getRadioLists } = require('../../../module');

module.exports = async (ctx, next) => {
	const props = {
		method: 'get',
		params: {},
		option: {},
	};
	const { status, body } = await api_qq_getRadioLists(props);
	Object.assign(ctx, {
		status,
		body,
	});
};
