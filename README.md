

## Instructions to run the project Locally

After cloning the repo run:

### `npm install`

to install the required node_modules

then start to project locally:

### `npm start`

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Project Structure

### JSstore

+ [Storage_services](/src/Storage_service)
ALl jsstore config are located on Storage_service folder.


+ [idb_services](/src/Storage_service/idb_service.js)
idb_services file contain the connection config and the database.

+ [instance_services](/src/Storage_service/instance_service.js)
instance_services file contain the operations functions to Get/Update/Insert/Delete records from Instances table.

### Components 
folder that conatain the ui components for now it contain only input.

### App.js
main component that contain all scripts.