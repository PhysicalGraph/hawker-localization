import config from  '~/config.json';
import contentful from 'contentful-management';


export function uploadToContentful(deviceInfoToUpdate) {

  var client = contentful.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })


  client.getSpace(config.uploadToContentfulSpace)
  .then((space) => {
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
    }, 200)
  })
}
