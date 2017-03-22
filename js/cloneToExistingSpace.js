import config from  '~/config.json';
import ContentfulManagement from 'contentful-management';
import spaceExport from 'contentful-export';
import spaceImport from 'contentful-import';
import chalk from 'chalk';
import fs from 'fs'

const fileFolder = './staticContentfulFiles/'
let cloneToNewSpace = () => {
  const client = ContentfulManagement.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })

  let cloneFromOptions = {
    spaceId: config.cloneFromContentfulSpace,
    managementToken: config.uploadToContentfulManagementToken,
    version: true,
    maxAllowedLimit: 100,
    includeDrafts: false,
    exportDir: './staticContentfulFiles'
  }

  fs.readdir(fileFolder, (err, files) => {
    files.forEach(file => {
      fs.unlink(fileFolder + file, (err, done) => {
        if (done) {
          console.log("FILE REMOVED!");
        }
      })
    });
  })

  client.getSpaces()
  .then((allSpaces) => {
    spaceExport(cloneFromOptions)
    .then(() => {
      console.log(chalk.green('\n Cloned space content found \n'))
      fs.readdir(fileFolder, (err, file) => {
        let uploadFile = fileFolder + file[0]
        fs.readFile(uploadFile, (err, contentJSON) => {
          let parsedUploadContent = JSON.parse(contentJSON);
          let cloneToOptions = {
            version: true,
            spaceId: config.cloneToExistingSpace,
            managementToken: config.uploadToContentfulManagementToken,
            content: parsedUploadContent
          }

          spaceImport(cloneToOptions)
          .then((finalOutput) => {
            console.log(chalk.green('\n *** All Data Imported successfully *** \n'))
          }, (err) => {
            recursiveUploadAttempt(parsedUploadContent, err)
          })
          .catch((err) => {
            if (err.message = "The resource could not be found.") {
              console.log(chalk.red('The space could not be found.'));
            }
          })
        })
      })
    })
  })
}

let recursiveUploadAttempt = (uploadContent, err) => {
  if (err.name === "Conflict") {
    console.log(' ****** Attempting to upload again with filtered content ******')
    let jsonMessage = err.message
    let parsedMessage = JSON.parse(err.message)
    let payloadJSON = parsedMessage.request.payloadData;
    let parsedPayload = JSON.parse(payloadJSON)

    // save this to a file
    let faultObject = uploadContent.webhooks.filter((obj) => {
      return obj.name === parsedPayload.name
    })

    let missingEntriesFile = './missingEntries/missingFromExistingImport.txt'

    fs.appendFile(missingEntriesFile, '\n\n' + JSON.stringify(faultObject), function (err) {
      if (err) throw err;
      console.log('\n *** Added to missing entry to file *** \n ');
    });

    let filteredUploadWebhooks = uploadContent.webhooks.filter((obj) => {
      return obj.name !== parsedPayload.name
    })

    let filteredUploadObject = uploadContent
    filteredUploadObject.webhooks = filteredUploadWebhooks

    // upload with new filteredUploadObject
    let newUploadOptions = {
      version: true,
      spaceId: config.cloneToExistingSpace,
      managementToken: config.uploadToContentfulManagementToken,
      content: filteredUploadObject
    }

    // Then will have to handle the recursive call
    uploadContentAfterError(newUploadOptions, err)
  } else {
    // if the error is not from a conflict, return the error
    return err
  }
}


let uploadContentAfterError = (cloneToOptions, err) => {
  let uploadContent = cloneToOptions.content;
  spaceImport(cloneToOptions)
  .then((finalOutput) => {
    console.log(chalk.green('\n **** All Data Imported successfully **** \n'))
  }, (err) => {
    console.log(' ****** Error in uploading an entry. ******')
    recursiveUploadAttempt(uploadContent, err)
  })
}


cloneToNewSpace();
