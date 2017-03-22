# hawker-localization

## Purpose
The purpose of this repo is to provide tools for managing Contentful. **MAKE SURE** to read the documentation before running any of these scripts. Some of these scripts are destructive. If the wrong space is written into the config file, content can be permanently lost.


## Setup
Make config.json file on the root with this template
```
{
  "cloneFromContentfulSpace": "",
  "cloneFromContentfulToken": "",
  "uploadToContentfulSpace": "",
  "uploadToContentfulToken": "",
  "uploadToContentfulManagementToken": "",
  "cloneToExistingSpace": "",
  "cloneToExistingToken": "",
  "deleteContentsSpace": "",
  "deleteContentsToken": "",
  "uploadSpaceName" : ""
}
```
- Set the proper variables
- Get your [managementToken here](https://www.contentful.com/developers/docs/references/authentication/#the-management-api) at the bottom of the page
- `uploadSpaceName` is the name of the space that you will be creating
- Run **npm install** to get all node modules
- Run **npm run babel** to build everything. This should be done after any change to the code inside of main.js, but is not necessary in other files


## Copying content
- Contentful documentation is currently wrong. It does not handle rate-limit well at this point.
- Go into `node_modules/contentful-export/dist/run-contentful-export.js`
- Change the code one lines 62 - 68 to the following:
```
var clients = (0, _createClients2.default)(opts);
return (0, _getFullSourceSpace2.default)({
  managementClient: clients.source.management,
  spaceId: opts.spaceId,
  maxAllowedLimit: 100,
  includeDrafts: opts.includeDrafts
}).then(function (response) {
```
This is hard-coding `maxAllowedLimit` to prevent rate-limit errors from occuring


### Copying to an existing space ###
- Be sure the config file is up-to-date
- First run **npm run deleteAllEntries** (see below on how to run this file if an error occurs) this will remove all entries from the space, but not delete the space
- Next, run **npm run cloneToExistingSpace**. This will copy all content from `cloneFromContentfulSpace` into a JSON file located in `staticContentfulFiles/`. It will then attempt to upload all content from this file
- These two together will remove all content from one space, then upload all entries from another

_This script will now save the information of conflicted/non-working entires_
- When cloneToExistingSpace runs, it will attempt to upload all entries
- When it runs into a non-working entry, which throws a 409, the script  saves this entry into the `missingFromExistingImport.txt` file inside of the `missingEntries/` directory
- The script then removes this entry from the upload content and tries again
- This may happen several times. Each time it hits a 409, it will save the new non-working entry and try again. You may hit a request limit. If this happens, just wait a few minutes and try again


### To copy to a new space ###
- **WARNING** this will completely remove and recreate a space with the name specified in uploadSpaceName
- If there already exists a space with this name **THIS SPACE WILL BE ERASED** and recreated. The space ID and token will be new. Content will be copied to this new space from the space specified in cloneFromContentfulSpace
- Because of Contentful's rate limits, this script had to be slowed down. Expect it to take ~30 minutes
- To run: **npm run cloneToNewSpace**


## To run Contentful upload - Localization
- The script looks for headers with the underscore character. It assumes that the first column with an underscore "bg_BG" and all following columns are locales. This means that if a column that is not a locale contains an underscore "test_header", it will assume "test_header" is a locale, and all columns after "test_header" are locales too.
- The excel sheet must contain 'fieldID', 'entryID', and 'message' within the non-locale columns. Their order does not matter. It also does not matter how many non-locale headers there are, so long as the three required headers exist
- If you want to updated en-US, you must include it in one of the headers. Remember, if it is the first header, it must have an underscore "en_US"
- If the sheet contains two of the same header, then the second occurrence will overwrite the first
- Place this excel sheet into excelDocs directory
- Be sure all locales in this document are available in the given space. If the document has just one locale that is not available, or not written in the same way as they are in Contentful, the script **will not work**.
- One commonly mistaken locale is Serbian Cyrillic. Commonly mistaken as 'sr-RS' the correct format is 'sr-Cyrl-RS'
- The script will read every sheet in the excel doc. If there is one sheet that does not conform to these standards, the script will not work. Sometimes a sheet can be hidden. Be sure to unhide all sheets to verify that they conform to these standards
- Writing these locales with either underscores or hyphens is fine 'en_US' or 'en-US'
- **Be sure** to specify the correct space in the config file. If the incorrect space is written, content could be over written, or the script may just not work.
- Add the file path to main.js then run run **npm run babel**
- To run upload: **npm run uploadContent**


## Remove all content from a given space
- This tool is required when copying to an existing space
- **WARNING** this will remove all entries from the space specified in `deleteContentsSpace`. But it will not delete the space itself. So the spaceId and access token will remain the same
- To run: **npm run deleteAllEntries**


## To compare the two spaces
TODO: this has not been updated in awhile and is probably depricated
- This will compare all entries from the cloned space, to the 'upload space'
- At first, the newly created generated from 'cloneToNewSpace' will not have a spaceID or token
- To generate these, go into the space and click on APIs in the navigation panel
- To run **npm run compareSpaces**
- This will output a stringified json with the test results
- Suggested to use a json parser tool to view these results
- TODO: Make a better visualization of these results
