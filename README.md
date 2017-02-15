# hawker-localization

## Setup
make package.json file on the root with this template
```
{
  "cloneFromContentfulSpace": "",
  "cloneFromContentfulToken": "",
  "uploadToContentfulSpace": "",
  "uploadToContentfulToken": "",
  "uploadToContentfulManagementToken": "",
  "uploadSpaceName": ""
}
```
- Setup the proper variables
- Get your [managementToken here](https://www.contentful.com/developers/docs/references/authentication/#the-management-api) at the bottom of the page
- uploadSpaceName is the name of the space that you will be creating
- run **npm install** to get all node modules
- run **npm run babel** to build everything

## To copy to a new space
- **WARNING** this will completely remove and recreate a space with the name specified in uploadSpaceName
- Because of Contentful's rate limits, this script had to be slowed down. Epect it to take ~30 minutes
- to run **npm run cloneToNewSpace**

## To run Contentful upload
- The excel sheet must have 6 columns before the locale columns
- The excel sheet must contain 'fieldID', 'entryID', and 'message' within these 6 columns
- Specify the proper spaces in the config file
- to run **npm run uploadContent**

## To compare the two spaces
- This will compare all entries from the cloned space, to the 'upload space'
- At first, the newly created generated from 'cloneToNewSpace' will not have a spaceID or token
- To generate these, go into the space and click on APIs in the navigation panel
- to run **npm run compareSpaces**
- This will ouput a stringified json with the test results
- Suggested to use a json parser tool to view these results
- TODO: Make a better visualization of these results
