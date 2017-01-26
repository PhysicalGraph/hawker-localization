import config from  '~/config.json';
import contentful from 'contentful';
import {readExcel} from '../js/readExcel';
const XLSX = require('xlsx');

var client = contentful.createClient({
  space: config.contentfulSpace,
  accessToken: config.contentfulToken
})

client.sync({initial: true})
.then((response) => {
  // was working individually. The readExcel is just not getting the excel sheet properly
  const responseObj = JSON.parse(response.stringifySafe());
  const entries = responseObj.entries;
  console.log("\n ~~~~~~~~~~~~~~~~ entries[20]: ", entries[20]);
  
  console.log("readExcel; ", readExcel());
})
