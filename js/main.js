const pathToFile1 = 'excelDocs/Consolidated.xlsx';
import XLSX from 'xlsx';

import { convertExcelToContentfulObject } from '../js/convertExcelToContentfulObject';

let readExcel = () => {
  let workbook = XLSX.readFile(pathToFile1);
  convertExcelToContentfulObject(workbook);
}

readExcel()
