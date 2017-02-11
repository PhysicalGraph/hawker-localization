import config from  '~/config.json';

export function uploadToContentful(deviceInfoToUpdate, space) {
  // console.log('\n ********************************************* \n')
  // console.log('uploadToContentful called with deviceInfoToUpdate: ', deviceInfoToUpdate)
  // console.log('\n ********************************************* \n')

  setTimeout(() => {
    space.getEntry(deviceInfoToUpdate.deviceEntryID)
    .then((entry) => {
      for (let locale in deviceInfoToUpdate) {
        if (locale != 'deviceEntryID') {
          let currentLocale = deviceInfoToUpdate[locale]
          let currentLocaleCode = currentLocale.locale.replace(/_/g, "-")
          let translationMessage = currentLocale.translation;
          let entryID = currentLocale.entryID;
          let fieldToUpdate = currentLocale.fieldID;
          entry.fields[fieldToUpdate][currentLocaleCode] = translationMessage;
        }
      }
      entry.update()
      .then((updatedContentType) => {
        console.log('Update was successful')
      })
    })
    .catch((err) => {
      // might want to make a list of devices that were not updated.
      // call a module here that creates a list
      console.log('Err in finding a device: ', err)
    })
  }, 300)
}
