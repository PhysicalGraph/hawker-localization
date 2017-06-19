import config from  '~/config.json';
import ContentfulManagement from 'contentful-management';
import spaceExport from 'contentful-export';
import spaceImport from 'contentful-import';
import chalk from 'chalk';
import lodash from 'lodash';

let cloneToNewSpace = () => {
  const client = ContentfulManagement.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })

  let cloneFromOptions = {
    version: true,
    spaceId: config.cloneFromContentfulSpace,
    managementToken: config.uploadToContentfulManagementToken,
    maxAllowedLimit: 100,
    includeDrafts: false
  }

  let uploadSpaceName = 'newLocalizationTest'

  // *** Where everthing is kicked off ***
  client.getSpaces()
  .then((allSpaces) => {
    let uploadSpaceExists = false;
    let uploadSpaceID
    for (let space of allSpaces.items) {
      console.log('spaces found: ', space.name)
      if (space.name === uploadSpaceName) {
        uploadSpaceExists = true;
        uploadSpaceID = space.sys.id
      }
    }
    if (uploadSpaceExists) {
      console.log(chalk.green('\n Upload space with the name - '+uploadSpaceName+' - exists, deleting it now \n'))
      deleteAndRecreateUploadSpace(uploadSpaceID)
    } else {
      console.log(chalk.green('\n Upload space with the name - '+uploadSpaceName+'- does not exists. Making a new one. \n'))
      createNewSpace()
    }
  })

  // Makes a new space with the specified uploadSpaceName
  let createNewSpace = () => {
    client.createSpace({name: uploadSpaceName})
    .then((createdSpace) => {
      console.log(chalk.green('\n New space with the name - '+uploadSpaceName+' - has been created. \n'))
      uploadContentToNewSpace(createdSpace)
    })
    .catch((err) => {
      console.log('Error in createSpaceMembershipWithId: ', err)
    })
  }

  // With an existing space, this will delete it, then call createNewSpace()
  let deleteAndRecreateUploadSpace = (uploadSpaceID) => {
    client.getSpace(uploadSpaceID)
    .then((uploadSpace) => {
      uploadSpace.delete()
      .then(() => {
        console.log(chalk.green('\n Exisiting space successfully deleted \n'))
        createNewSpace()
      })
      .catch((err) => {
        console.log(chalk.red(' Error in deleting the space:', err))
      })
    })
    .catch((err) => {
      console.log(chalk.red('Err in retrieving upload space to delete: ', err));
    })
  }

  // Will upload cloned content to newly created space
  let uploadContentToNewSpace = (newSpace) => {
    console.log(chalk.green(JSON.stringify(cloneFromOptions, null, 2)));
    console.log("spaceExport(cloneFromOptions): ", spaceExport(cloneFromOptions))
    spaceExport(cloneFromOptions)
    .then((output) => {
      return new Promise((resolve, reject) => {
        if (output) {
          return setTimeout(resolve(output), 1000);
        } else {
          return reject(new Error("No output"))
        }
      })
    })
    .then((output) => {
      let dedupLocales = lodash.uniqBy(output.locales, 'code');
      output.locales = dedupLocales;
      console.log(chalk.green('\n Cloned space content found \n'))
      let uploadOptions = {
        content: output,
        spaceId: newSpace.sys.id,
        managementToken: config.uploadToContentfulManagementToken
      }

      spaceImport(uploadOptions)
      .then((finalOutput) => {
        console.log(chalk.green('\n *** All Data Imported successfully *** \n'))
      })
      .catch((err) => {
        console.log(chalk.red('Error in uploading the space: ', err))
      })
    })
    .catch((err) => {
      console.log(chalk.red('uploadContentToNewSpace err: ', err));
      if (err.message = "The resource could not be found.") {
        console.log(chalk.red('The space could not be found.'));
      }
    })
  }

}

cloneToNewSpace();
