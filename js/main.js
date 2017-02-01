const pathToFile1 = 'excelDocs/Turkish\ -with\ SL\ mapping\ keyword.xlsx';
const pathToFile2 = 'excelDocs/testSheet.xlsx';
const pathToFile3 = 'excelDocs/completeTestSheet.xlsx';
const pathToFile4 = 'excelDocs/testTestLocaleCodes.xlsx'
import XLSX from 'xlsx';

import { convertExcelToContentfulObject } from '../js/convertExcelToContentfulObject';

let readExcel = () => {
  let workbook = XLSX.readFile(pathToFile4);
  convertExcelToContentfulObject(workbook);
}

readExcel()
