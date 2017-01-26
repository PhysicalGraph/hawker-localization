// Documentation for uploading found here:
// https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/resource-ids

// get a single entry:
// https://api.contentful.com/spaces/space_id/entries/entry_id

// PUBLISH an entry PUT:
// https://api.contentful.com/spaces/space_id/entries/entry_id
// include in the POST request:
// Fields Object
//// Title Object
////// en-us: string
//// Body Object
////// en-us: string

import rp from 'request-promise';
import config from  '~/config.json';
import request from 'request'

export function uploadToContentful(entryId, updatedEntry) {
  console.log('uploadToContentful called!')
  let queryString = 'https://api.contentful.com/spaces/'+config.contentfulSpace+'/entries/'+'entryId'+'/?access_token='+config.contentfulManagementToken;
  console.log('queryString: ', queryString);
  // initially GET the entry
  let getItem = rp(queryString);
  getItem.then(function(entireBody) {
    // THEN update the entry. Send back to Contentful the entireBody + updated information
    // Will need to update this to send back an updated body
    request.post({url:queryString}, function (e, r, body) {
      if (e) {
        console.log(e)
      } else {
        console.log(body)
      }
    })
    console.log('entireBody returned as: ', entireBody)
  })
}
