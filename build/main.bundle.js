'use strict';

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _contentful = require('contentful');

var _contentful2 = _interopRequireDefault(_contentful);

var _convertExcelToContenfulObject = require('../js/convertExcelToContenfulObject');

var _convertExcelToContenfulObject2 = _interopRequireDefault(_convertExcelToContenfulObject);

var _readExcel = require('../js/readExcel');

var _readExcel2 = _interopRequireDefault(_readExcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = _contentful2.default.createClient({
  space: _config2.default.contentfulSpace,
  accessToken: _config2.default.contentfulToken
});

client.sync({ initial: true }).then(function (response) {
  console.log(response.entries);
  console.log(response.assets);
});
