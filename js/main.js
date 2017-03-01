const pathToFile = 'excelDocs/1046.xlsx';
import XLSX from 'xlsx';

import { convertExcelToContentfulObject } from '../js/convertExcelToContentfulObject';

let readExcel = () => {
  let workbook = XLSX.readFile(pathToFile);
  convertExcelToContentfulObject(workbook);
}

readExcel()
