const { getDigitalAlbumLists: api_qq_getDigitalAlbumLists } = require('../../../module');

module.exports = async (ctx, next) => {
	const props = {
		method: 'get',
		params: {},
		option: {},
	};
	const { status, body } = await api_qq_getDigitalAlbumLists(props);
	Object.assign(ctx, {
		status,
		body,
	});
};
