import { uploadToContentful } from '../js/uploadToContentful'
import config from  '~/config.json';
import contentful from 'contentful-management';


let convertExcelToContentfulObject = (readExcelDoc) => {
  var client = contentful.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })

  client.getSpace(config.uploadToContentfulSpace)
  .then((uploadSpace) => {

  const allSheetsObject = readExcelDoc["Sheets"];
  const sheetNameArray = Object.keys(allSheetsObject)
  const numberOfSheets = sheetNameArray.length;

  // this will go over each sheet
  for (var sheetIndex = 0; sheetIndex < numberOfSheets; sheetIndex++) {
    let currentSheetName = sheetNameArray[sheetIndex]
    let currentSheet = allSheetsObject[currentSheetName]

    // 'A1 -> Z1 and An -> Zn'
    const allLetterNumberEntries = Object.keys(currentSheet)
    // might have to split this for locales
    const firstRowLetters = []

    // loops over all single letters (A - Z)
    let singleLetterLength = allLetterNumberEntries.length >= 26 ? 26 : allLetterNumberEntries.length -1;
    for (var singleLetterIndex = 0; singleLetterIndex <= singleLetterLength; singleLetterIndex++) {
      let currentTargetKey = allLetterNumberEntries[singleLetterIndex]
      if (currentTargetKey.length < 3) {
        if (currentTargetKey[1] === '1') {
          firstRowLetters.push(currentTargetKey[0])
        }
      }
    }

      // loops over all double letters (AA - ZZ)
      // Starts at 27 because there are 26 letters in the alphabet
      for (var doubleLetterIndex = 27; doubleLetterIndex < allLetterNumberEntries.length; doubleLetterIndex ++) {
        let currentTargetKey = allLetterNumberEntries[doubleLetterIndex];
        if (currentTargetKey[currentTargetKey.length -1] === '1' && firstRowLetters.indexOf(currentTargetKey[currentTargetKey.length -2]) != -1) {
          firstRowLetters.push(currentTargetKey[0] + currentTargetKey[1])
        }
      }

      let nextTargetHeader = ""
      let columnNames = [];
      let fixedLocales = [];
      let index = 0;
      // Loop here that goes over the first columns until it hits an entry with "_"
      while (!nextTargetHeader.match(/[_]/g)) {
        // this will indicate that it has gotten to the locales
        columnNames.push(currentSheet[firstRowLetters[index]+'1']['w'])
        nextTargetHeader = currentSheet[firstRowLetters[index +1]+'1']['w'];
        index++
      }

      let locales = [];
      for (var rowCount = columnNames.length; rowCount < firstRowLetters.length; rowCount++) {
        // human redable names are stored in the sheet with the key 'w'
        locales.push(currentSheet[firstRowLetters[rowCount]+'1']['w'])
      }


      const numberOfColumns = columnNames.length + locales.length;
      // AA## -> and extract the number
      // ** if every cell if full - const numberOfEntires = allLetterNumberEntries/numberOfColumns
      // otherwise extract the last digits of the last numberLetter key in the
      let numberOfRows = ''
      const lastEntry = allLetterNumberEntries[allLetterNumberEntries.length -1];
      for (var lastEntryStringIndex = 0; lastEntryStringIndex < lastEntry.length; lastEntryStringIndex ++) {
        if (Number(lastEntry[lastEntryStringIndex])) {
          numberOfRows += lastEntry[lastEntryStringIndex]
        }
      }
      numberOfRows = Number(numberOfRows);
      const numberOfEntires = numberOfColumns*numberOfRows

      // this will loop over each row for each sheet
      // starts at 2 becuase A1 - Z1 are the named columns
      for (var rowIndex = 2; rowIndex <= numberOfRows; rowIndex++) {
        // the object for each device
        let deviceInfoToUpdate = {};
        // this will loop over each locale and store the updated information under each locale name
        for (var localeIndex = 0; localeIndex < locales.length; localeIndex++) {
          let localeInfoToUpdate = {};
          let currentLocale = locales[localeIndex];
          let adjustedCloumnIndex = columnNames.length + localeIndex;
          // Sets the lettered coulmn (A -> ZZ) to become letter + number index of the excel sheet (A# -> ZZ#)
          let localeLetteredNumberKey = firstRowLetters[adjustedCloumnIndex] + rowIndex.toString();
          let translatedMessage = currentSheet[localeLetteredNumberKey]
          let readableTranslatedMessage = "";
          if (translatedMessage != undefined) {
            readableTranslatedMessage = translatedMessage['w'];
          }

          // this will loop over each column for each row
          for (var columnRowIndex = 0; columnRowIndex < columnNames.length; columnRowIndex++) {
            let currentColumnName = columnNames[columnRowIndex];
            let letteredColumn = firstRowLetters[columnRowIndex]
            // the same numbers are apart of the same entry (A2...Z2)
            let currentKey = letteredColumn + rowIndex.toString();
            if (currentSheet[currentKey] != undefined) {
              let cellContent = currentSheet[currentKey]['w'];
              // will save the key with spacing removed
              localeInfoToUpdate[currentColumnName.replace(/\s+/g,'')] = cellContent;
            }

            let insert = (str, index, value) => {
              return str.substr(0, index) + value + str.substr(index);
            }

            let numsToNotNewlineon = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let firstNumberNewLine = readableTranslatedMessage.replace("\r\n1.", "\n \r\n1.");
            let lastNewlineIndex = firstNumberNewLine.lastIndexOf("\r\n")
            let chatAfterLastNewline = firstNumberNewLine[lastNewlineIndex+2]
            // chatAfterLastNewline is a letter and not a number, meaning it is no longer part of the numbered instructions
            if (numsToNotNewlineon.indexOf(chatAfterLastNewline) === -1) {
              localeInfoToUpdate.translation = insert(firstNumberNewLine, lastNewlineIndex, " \n ")
            } else {
              localeInfoToUpdate.translation = firstNumberNewLine;
            }

            localeInfoToUpdate.locale = currentLocale;

              // then add correct formatting: numbers on newline, letters on newline with indent
              let indentedCharacters = [' a.', ' b.', ' c.', ' d.', ' e.', ' f.', ' g.', ' h.', ' i.', ' j.', ' б.', ' в.', ' г.']
              let translatedMessageLength = localeInfoToUpdate.translation.length;
              let newlineTranslation = '';
              let wasTranslationModified = false;

              for (var i = 0; i < translatedMessageLength; i++) {
                let targetCharacter = localeInfoToUpdate.translation[i] + localeInfoToUpdate.translation[i +1] + localeInfoToUpdate.translation[i + 2];
                newlineTranslation += localeInfoToUpdate.translation[i];

                if (indentedCharacters.indexOf(targetCharacter) > -1) {
                  wasTranslationModified = true
                  newlineTranslation += '\n'
                  newlineTranslation += '\t'
                }
              }

              if (wasTranslationModified) {
                // adds newline at the end of the numbered list
                localeInfoToUpdate.translation = newlineTranslation;
              }

            if (deviceInfoToUpdate.deviceEntryID === undefined) {
              deviceInfoToUpdate.deviceEntryID = localeInfoToUpdate.entryID;
            }

            if (deviceInfoToUpdate.message === undefined) {
              deviceInfoToUpdate.message = localeInfoToUpdate.message;
            }

            deviceInfoToUpdate[currentLocale] = localeInfoToUpdate;
          }
        }
        setTimeout(() => {
          uploadToContentful(deviceInfoToUpdate, uploadSpace, rowIndex)
        }, 200)
      }
    }
})
  .catch((err) => {
    console.log('There was an error in getting the space!: ', err)
  })
}

export { convertExcelToContentfulObject }
