'use strict';

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _contentful = require('contentful');

var _contentful2 = _interopRequireDefault(_contentful);

var _readExcel = require('../js/readExcel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XLSX = require('xlsx');

var client = _contentful2.default.createClient({
  space: _config2.default.contentfulSpace,
  accessToken: _config2.default.contentfulToken
});

client.sync({ initial: true }).then(function (response) {
  // was working individually. The readExcel is just not getting the excel sheet properly
  var responseObj = JSON.parse(response.stringifySafe());
  var entries = responseObj.entries;
  console.log("\n ~~~~~~~~~~~~~~~~ entries[20]: ", entries[20]);

  console.log("readExcel; ", (0, _readExcel.readExcel)());
});
