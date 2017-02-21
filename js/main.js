const pathToFile = 'excelDocs/bugTesting.xlsx';
import XLSX from 'xlsx';

import { convertExcelToContentfulObject } from '../js/convertExcelToContentfulObject';

let readExcel = () => {
  let workbook = XLSX.readFile(pathToFile);
  convertExcelToContentfulObject(workbook);
}

readExcel()
