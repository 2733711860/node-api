const { uploadPicture } = require('./pic/api_upload_picture');
const { addRoute } = require('./vue-route/api_add_route');
const { getRoute } = require('./vue-route/api_get_route');

module.exports = {
  uploadPicture,
  addRoute,
  getRoute
};
