const request = require('../../util/qqRequest/request');
const config = require('../../config/qq-request-config');

module.exports = ({ options = {}, method = 'get' }) => {
	let opts = Object.assign(options, config.commonParams, {
		headers: {
			referer: 'https://y.qq.com/portal/player.html',
			host: 'u.y.qq.com',
			'content-type': 'application/x-www-form-urlencoded',
		},
	});
	return request('https://u.y.qq.com/cgi-bin/musicu.fcg', method, opts, 'u');
};
