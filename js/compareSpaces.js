// want to go through each entry from the cloned space
  // compare each feild from each entry to the copied space
  // IF an entry from the copied space does not exist in the cloned space
    // OR if a field on one of the entries does not exist on the other
      // alert the user - this could be handled in two seperate ways
      // either alert for the entry that is missing, or alert that a field on a specfic entry is missing
  // OTHERWISE alert that all is good, and the space was cloned over correctly

  // create an object of tests. Keys being the tests, values being results
  // set these as you go, then in the end, read from this object

import config from  '~/config.json';
import ContentfulManagement from 'contentful-management';

let testResults = {
  sameLength: {
    result: true,
    missingEntries: []
  },
  sameKeys: {
    result: true,
    differingEntries: []
  },
  sameFields: {
    result: true,
    differingEntryFields: []
  }
}

let compareEntries = (allValidatedEntries, allTestEntries) => {
  allValidatedEntries = allValidatedEntries.items
  allTestEntries = allTestEntries.items
  let validatedIdFieldMap = compareObjectBuilder(allValidatedEntries)
  let testIdFieldMap = compareObjectBuilder(allTestEntries)

  // first test if there are the same # of entries
  if (allValidatedEntries.length != allTestEntries.length) {
    testResults.sameLength.result = false;
    // console.log('findMissingEntries: ', findMissingEntries(validatedIdFieldMap, testIdFieldMap));
    findMissingEntries(validatedIdFieldMap, testIdFieldMap);
  }


  let testKeys = (entryId, keyIndex, validatedEntry, validatedEntryKeys, testEntryKeys, testEntry) => {
    let missingkeysInformation = {};
    missingkeysInformation[entryId] = {};
    let testKey = validatedEntryKeys[keyIndex]
    if (testEntryKeys.indexOf(testKey) === -1) {
      testResults.sameKeys.result = false;
      missingkeysInformation[entryId].validatedEntry = validatedEntry;
      missingkeysInformation[entryId].testEntry = testEntry;
      missingkeysInformation[entryId].missingKey = testKey
      testResults.sameKeys.differingEntries.push(missingkeysInformation)
    }
  }

  let testFields = (entryId, keyIndex, validatedEntry, validatedEntryKeys, testEntryKeys) => {
    let testKey = validatedEntryKeys[keyIndex]
    // only compares keys from the validatedEntry that are in the testEntry
    // missing keys are caught in the pervious test
    let differentEntryFields = {};
    differentEntryFields[entryId] = {};
    if (testEntryKeys.indexOf(testKey) != -1) {
      let validatedEntryField = JSON.stringify(validatedIdFieldMap[entryId][testKey])
      let testEntryField = JSON.stringify(testIdFieldMap[entryId][testKey])
      // compares the value of each entry
      if (validatedEntryField !== testEntryField) {
        differentEntryFields[entryId].validatedEntry = validatedIdFieldMap[entryId][testKey]
        differentEntryFields[entryId].testEntry = testIdFieldMap[entryId][testKey]
        testResults.sameFields.result = false;
        testResults.sameFields.differingEntryFields.push(differentEntryFields)
      }
    }
  }

  for (var key in validatedIdFieldMap) {
    let validatedEntry = validatedIdFieldMap[key];
    let testEntry = testIdFieldMap[key];
    let entryId = validatedEntry.entryId;
    // prevents from comparing entries that are not in both
    if (testIdFieldMap[entryId] != undefined) {
      let validatedEntryKeys = Object.keys(validatedEntry);
      let testEntryKeys = Object.keys(testEntry);
      // loops over each key for each entry
      for (var keyIndex = 0; keyIndex < validatedEntryKeys.length; keyIndex++) {
        testKeys(entryId, keyIndex, validatedEntry, validatedEntryKeys, testEntryKeys, testEntry)
        testFields(entryId, keyIndex, validatedEntry, validatedEntryKeys, testEntryKeys)
      }
    }
  }

  console.log('testResults: ', JSON.stringify(testResults));

}

let findMissingEntries = (validatedIdFieldMap, testIdFieldMap) => {
  let allIds = Object.keys(validatedIdFieldMap);
  for (let idIndex = 0; idIndex < allIds.length; idIndex++) {
    let id = allIds[idIndex];
    if (testIdFieldMap[id] === undefined) {
      let missingEntry = validatedIdFieldMap[id];
      testResults.sameLength.missingEntries.push(missingEntry)
    }
  }
}

let compareObjectBuilder = (arrayOfEntries) => {
  let entryIdMap = {};
  for (var entry of arrayOfEntries) {
    let targetEntry = entry.fields
    targetEntry.entryId = entry.sys.id;
    entryIdMap[entry.sys.id] = targetEntry;
  }
  return entryIdMap
}

let compareSpaces = () => {
  const client = ContentfulManagement.createClient({
    accessToken: config.uploadToContentfulManagementToken
  })

  client.getSpace(config.cloneFromContentfulSpace)
  .then((space) => {
    space.getEntries({'limit':'1000'})
    .then((allValidatedEntries) => {
      client.getSpace(config.uploadToContentfulSpace)
      .then((testSpace) => {
        testSpace.getEntries({'limit':'1000'})
        .then((allTestEntries) => {
          compareEntries(allValidatedEntries, allTestEntries)
        })
      })
    })
  })
  .catch((err) => {
    console.log('err: ', err);
  })
}

compareSpaces()
