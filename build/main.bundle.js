'use strict';

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _convertExcelToContentfulObject = require('../js/convertExcelToContentfulObject');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathToFile1 = 'excelDocs/Turkish\ -with\ SL\ mapping\ keyword.xlsx';
var pathToFile2 = 'excelDocs/testSheet.xlsx';
var pathToFile3 = 'excelDocs/completeTestSheet.xlsx';
var pathToFile4 = 'excelDocs/testTestLocaleCodes.xlsx';


var readExcel = function readExcel() {
  var workbook = _xlsx2.default.readFile(pathToFile4);
  (0, _convertExcelToContentfulObject.convertExcelToContentfulObject)(workbook);
};

readExcel();
