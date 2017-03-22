import config from  '~/config.json';
import ContentfulManagement from 'contentful-management';
import spaceExport from 'contentful-export';
import spaceImport from 'contentful-import';
import chalk from 'chalk';

let cloneToNewSpace = () => {
  const client = ContentfulManagement.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })

  client.getSpace(config.deleteContentsSpace)
  .then((space) => {
    space.getEntries({'limit':'1000'})
    .then((allEntries) => {
      if (allEntries.items.length === 0) {
        console.log(chalk.green("\n *** Congratulations! The space is empty *** \n"))
      } else {
        console.log('Number of entries to be deleted: ', allEntries.items.length);
      }
      for (var i = 0; i<allEntries.items.length; i++) {
        let entryId = allEntries.items[i].sys.id;
        space.getEntry(entryId)
        .then((entry) => {
          // if the entry is published, it must be deleted first
          if (entry.isPublished()) {
            entry.unpublish()
            .then((unPublishResult) => {
              deleteEntry(unPublishResult)
            })
            .catch((err) => {
              console.log(" err in unpublishing entry: ", err)
            })
          } else {
            // otherwise, if it is unpublished, it can just be deleted
            deleteEntry(entry)
          }
        })
        .catch((err) => {
          console.log(" err in getting single entry: ", err)
        })
      }
    })
    .catch((err) => {
      console.log(" err in getting entries: ", err)
    })
  })
  .catch((err) => {
    console.log(" err in getting space: ", err)
  })
}

let deleteEntry = (entry) => {
  entry.delete()
  .then((deletedEntry) => {
    console.log('Deleted and entry')
  })
  .catch((err) => {
    console.log(" err in deleting single entry: ", err)
  })
}

cloneToNewSpace();
