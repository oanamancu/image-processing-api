# Image Processing API

## About

App that transforms user image to certain width and height.

## endpoint '/images':
- Method: GET 
- mandatory query parameters: filename, width, height 
- ex: http://localhost:3000/images?filename=fjord&width=500&height=500
- return codes:
    - 201 if new file was created along with the newly created file
    - 200 if transformed file already exists along with the file
    - 400 for bad query parameters
    - 500 for server side error

## How to start it:
- install npm on your machine
- download projet from [here](https://github.com/oanamancu/image-processing-api)
- install dependencies: npm install 
- run server: npm run start 