/*
Returned from readExcel (input):
https://jsonblob.com/09dd3afe-e260-11e6-90ab-8b5720ff08a9

Example Contentful entry (output)
{ sys:
     { space: [Object],
       id: '5l6Kde2fEkGu0Oqek8YkMc',
       type: 'Asset',
       createdAt: '2017-01-23T23:54:45.668Z',
       updatedAt: '2017-01-23T23:54:45.668Z',
       revision: 1 },
    fields: { title: [Object], file: [Object] }
  }

  */

  import {uploadToContentful} from '../js/uploadToContentful'


function convertExcelToContentfulObject(readExcelDoc){
  console.log('convertExcelToContenfulObject called')
  var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  // will include othersheets soon with object.arguments.length.
  // for now, will focus on 'Sheet1'
  // var readExcelDoc = JSON.parse(readExcelDoc);
  var targetSheet = readExcelDoc["Sheets"]["Sheet1"];

  // We will know how many columns there will be
  // But this can be dynamic. The columns names are in the
  // "A1" -> "Z1"... range.
  var columnNames = [];
  for (var i = 0; i < columns.length; i++) {
    columnNames.push(targetSheet[columns[i]+'1']['v'])
  }
  console.log('\n********************** columnNames: ', columnNames)

  var targetSheetKeys = Object.keys(targetSheet)
  var numberOfEntires = targetSheetKeys.length;
  console.log('\n ~~~~~~~~~~~~~~~~~~~~~~ numberOfEntires: ', numberOfEntires)
  var lastKey = targetSheetKeys[numberOfEntires -1]
  var lastEntry = targetSheet[lastKey]
  console.log(' convertExcelToContentfulObject lastEntry: ', lastEntry['v'])

  // loop over the keys that are in targetSheetKeys (A2...Zn)
    // the same numbers are apart of the same entry (A2...Z2)
      // make an entry similar to the Contentful entry per Excel entry
   // loop through until at the end of the targetSheetKeys

   // Later... Call the Contentful POST per item.
   uploadToContentful('2KjcNVuNtCCMsKy2akaYuu')
}

export { convertExcelToContentfulObject }
