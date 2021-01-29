const { getMvByTag: api_qq_getMvByTag } = require('../../../module');

// songmid=001CLC7W2Gpz4J
module.exports = async (ctx, next) => {
	const props = {
		method: 'get',
		params: {},
		option: {},
	};
	const { status, body } = await api_qq_getMvByTag(props);
	Object.assign(ctx, {
		status,
		body,
	});
};
