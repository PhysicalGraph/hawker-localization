import config from  '~/config.json';

export function uploadToContentful(deviceInfoToUpdate, uploadSpace, rowIndex) {
  let waitTime = rowIndex * 100;

  if (deviceInfoToUpdate.deviceEntryID != undefined) {
    setTimeout(() => {
      uploadSpace.getEntry(deviceInfoToUpdate.deviceEntryID)
      .then((entry) => {
        for (let locale in deviceInfoToUpdate) {
          if (locale.toString() != 'deviceEntryID') {
            let currentLocale = deviceInfoToUpdate[locale]
            let currentLocaleCode = currentLocale.locale.replace(/_/g, "-").toString();
            let translationMessage = currentLocale.translation;
            let entryID = currentLocale.entryID;
            let fieldToUpdate = currentLocale["fieldID"].toString();
            if (entry.fields[fieldToUpdate] === undefined) {
              entry.fields[fieldToUpdate] = {};
            }
            entry.fields[fieldToUpdate][currentLocaleCode] = translationMessage;
          }
        }
        entry.update()
        .then((updatedContentType) => {
          console.log('Update was successful')
        })
        .catch((err) => {
          console.log('\n ############### UPDATING entry ERROR: ', err)
          console.log('\n ############### entry: ', entry)
        })
      }).
      catch((err) => {
        if (err.message = "The resource could not be found") {
          console.log('\n ****************** Could not find device with ID: ', deviceInfoToUpdate.deviceEntryID)
          console.log('\n ****************** There was an err in getting an item! for deviceInfoToUpdate: ', err)
        } else {
          console.log('\n ****************** There was an err in getting an item! for deviceInfoToUpdate: ', err)
          console.log('\n ****************** deviceInfoToUpdate: ', JSON.stringify(deviceInfoToUpdate))
        }
      })
    }, waitTime)
  }
}
