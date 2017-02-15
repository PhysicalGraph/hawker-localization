import {uploadToContentful} from '../js/uploadToContentful'
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
      for (var singleLetterIndex = 0; singleLetterIndex <= 26; singleLetterIndex++) {
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

      // gets the named columns per sheet
      let columnNames = [];
      let locales = [];
      // set at 5 because that is the column where the named columns become locale colums
      for (var rowCount = 0; rowCount < 6; rowCount++) {
        // human redable names are stored in the sheet with the key 'v'
        columnNames.push(currentSheet[firstRowLetters[rowCount]+'1']['v'])
      }
      for (var rowCount = columnNames.length; rowCount < firstRowLetters.length; rowCount++) {
        // human redable names are stored in the sheet with the key 'v'
        locales.push(currentSheet[firstRowLetters[rowCount]+'1']['v'])
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
      // const numberOfEntires = allLetterNumberEntries.length
      // const numberOfRows = Math.floor(numberOfEntires/numberOfColumns);


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
            readableTranslatedMessage = translatedMessage['v']
          }

          // this will loop over each column for each row

          for (var columnRowIndex = 0; columnRowIndex < columnNames.length; columnRowIndex++) {
            let currentColumnName = columnNames[columnRowIndex];
            let letteredColumn = firstRowLetters[columnRowIndex]
            // the same numbers are apart of the same entry (A2...Z2)
            let currentKey = letteredColumn + rowIndex.toString();
            if (currentSheet[currentKey] != undefined) {
              let cellContent = currentSheet[currentKey]['v'];
              // will save the key with spacing removed
              localeInfoToUpdate[currentColumnName.replace(/\s+/g,'')] = cellContent;
            }
            localeInfoToUpdate.locale = currentLocale;
            // Removes any extra spacing from the translation.
            let isRightJustified = false;
            if (currentLocale === 'ar_AE') {
              isRightJustified = true;
              localeInfoToUpdate.translation = readableTranslatedMessage;
            } else {
              localeInfoToUpdate.translation = readableTranslatedMessage.replace(/\s+/g,' ').trim();
            }

            if (!isRightJustified) {
              // then add correct formatting: numbers on newline, letters on newline with indent
              let newLineCharacters = [' 1.', ' 2.', ' 3.', ' 4.', ' 5.', ' 6.', ' 7.', ' 8.', ' 9.', ' 10.']
              let indentedCharacters = [' a.', ' b.', ' c.', ' d.', ' e.', ' f.', ' g.', ' h.', ' i.', ' j.', ' б.', ' в.', ' г.']
              let translatedMessageLength = localeInfoToUpdate.translation.length;
              let newlineTranslation = '';
              let wasTranslationModified = false;
              for (var i = 0; i < translatedMessageLength; i++) {
                newlineTranslation += localeInfoToUpdate.translation[i];
                let targetCharacter = localeInfoToUpdate.translation[i] + localeInfoToUpdate.translation[i +1] + localeInfoToUpdate.translation[i + 2];
                if (newLineCharacters.indexOf(targetCharacter) > -1) {
                  newlineTranslation += '\n'
                  wasTranslationModified = true
                }
                if (indentedCharacters.indexOf(targetCharacter) > -1) {
                  newlineTranslation += '\n'
                  newlineTranslation += '\t'
                }
              }
              if (wasTranslationModified) {
                localeInfoToUpdate.translation = newlineTranslation;
              }
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
