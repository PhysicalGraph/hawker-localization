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

function convertExcelToContenfulObject(readExcelDoc){
  var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  // will include othersheets soon with object.arguments.length.
  // for now, will focus on 'Sheet1'
  var targetSheet = readExcelDoc["Sheet1"];

  // We will know how many columns there will be
  // But this can be dynamic. The columns names are in the
  // "A1" -> "Z1"... range.
  var columnNames = [];
  for (var i = 0; i < columns.length; i++) {
    columnNames.push(targetSheet[columns[i]+'1'])
  }
  var numberOfEntires = targetSheet.arguments.length;
  var lastEntry = targetSheet[numberOfEntires -1]

  console.log(' convertExcelToContentfulObject lastEntry: ', lastEntry)
  console.log(' convertExcelToContentfulObject columnNames: ', columnNames)
}

export { convertExcelToContenfulObject }
