import config from  '../config.json';
import contentful from 'contentful';
import convertExcelToContentfulObject from '../js/convertExcelToContenfulObject';
import readExcel from '../js/readExcel';

var client = contentful.createClient({
  space: config.contentfulSpace,
  accessToken: config.contentfulToken
})

client.sync({initial: true})
.then((response) => {
  console.log(response.entries)
  console.log(response.assets)
})
