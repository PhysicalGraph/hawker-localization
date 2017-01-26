const pathToFile1 = 'excelDocs/Turkish\ -with\ SL\ mapping\ keyword.xlsx';
const pathToFile2 = 'excelDocs/testSheet.xlsx';
import XLSX from 'xlsx';
import { convertExcelToContentfulObject } from '../js/convertExcelToContentfulObject';

export function readExcel() {
  console.log('readExcel called with path: ', pathToFile2);
  let workbook = XLSX.readFile(pathToFile2);
  // console.log('workbook is ', workbook);
  // console.log('readExcel called. workbook is: ', JSON.stringify(workbook));
  convertExcelToContentfulObject(workbook);
}
