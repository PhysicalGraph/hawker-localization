const pathToFile = '../excelDocs/testSheet.xlsx';
import XLSX from 'xlsx';
import convertExcelToContentfulObject from '../js/convertExcelToContenfulObject';

function readExcel() {
  let workbook = XLSX.readFile(pathToFile);
  convertExcelToContentfulObject(workbook);
}
