import config from  '~/config.json';
import ContentfulManagement from 'contentful-management';
import spaceExport from 'contentful-export';
import spaceImport from 'contentful-import';
import chalk from 'chalk';

let newLocales = [
  {
    "name": "Burmese (Myanmar [Language])",
    "code": "my-ZG",
    "fallbackCode": "my-MM"
  }
]


let createNewLocales = () => {
  const client = ContentfulManagement.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })
  client.getSpace(config.uploadToContentfulSpace)
  .then((space) => {
    for (var i = 0; i < newLocales.length; i++) {
      (index => {
        console.log('Trying to upload locale: ', newLocales[index])
        space.createLocale(newLocales[index])
        .then((result) => {
          console.log('result: ', result)
        })
        .catch((err) => {
          console.log('err in making locale: ', err)
        })
      })(i)
    }
  })
  .catch((err) => {
    console.log('err in getting space: ', err)
  })
}

createNewLocales();
