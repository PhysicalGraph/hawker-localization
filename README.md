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
  "uploadSpaceName": ""
}
```
- Setup the proper variables
- Get your [managementToken here](https://www.contentful.com/developers/docs/references/authentication/#the-management-api) at the bottom of the page
- 'uploadSpaceName' is the name of the space that you will be creating
- Run **npm install** to get all node modules
- Run **npm run babel** to build everything

## To copy to a new space
- **WARNING** this will completely remove and recreate a space with the name specified in uploadSpaceName
- If there already exists a space with that name **THIS SPACE WILL BE ERASED** and the content will be copied from the space specified in cloneFromContentfulSpace
- Because of Contentful's rate limits, this script had to be slowed down. Expect it to take ~30 minutes
- To run: **npm run cloneToNewSpace**

## To run Contentful upload
- The excel sheet must have 6 columns before the locale columns
- The excel sheet must contain 'fieldID', 'entryID', and 'message' within these 6 columns
- Specify the proper spaces in the config file
- To run: **npm run uploadContent**

## To compare the two spaces
- This will compare all entries from the cloned space, to the 'upload space'
- At first, the newly created generated from 'cloneToNewSpace' will not have a spaceID or token
- To generate these, go into the space and click on APIs in the navigation panel
- To run **npm run compareSpaces**
- This will ouput a stringified json with the test results
- Suggested to use a json parser tool to view these results
- TODO: Make a better visualization of these results

## Remove all content from a given space
- Unfinished for now
