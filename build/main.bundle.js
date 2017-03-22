'use strict';

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _convertExcelToContentfulObject = require('../js/convertExcelToContentfulObject');

var _convertExcelToContentfulObjectCopy = require('../js/convertExcelToContentfulObject-copy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathToFile = 'excelDocs/03-20-1413.xlsx';


var readExcel = function readExcel() {
  var workbook = _xlsx2.default.readFile(pathToFile);
  (0, _convertExcelToContentfulObject.convertExcelToContentfulObject)(workbook);
};

readExcel();
