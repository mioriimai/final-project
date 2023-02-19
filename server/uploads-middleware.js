/* code before edit uploads-middleware.js starts here */
// const path = require('path');
// const multer = require('multer');

// const imagesDirectory = path.join(__dirname, 'public/images');

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, imagesDirectory);
//   },
//   filename: (req, file, callback) => {
//     const fileExtension = path.extname(file.originalname);
//     const name = `${file.fieldname}-${Date.now()}${fileExtension}`;
//     callback(null, name);
//   }
// });

// const uploadsMiddleware = multer({ storage }).single('image');

// module.exports = uploadsMiddleware;
/* code ends here */

// const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3 } = require('@aws-sdk/client-s3');

// connect us to S3 on AWS
const s3 = new S3({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// create a storage adapter
const storage = multerS3({
  s3,
  acl: 'public-read',
  // ☝️ so that anyone with a url can view the file
  bucket: process.env.AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // ☝️ so that when the file is downloaded,
  // the proper Content-Type header is set in the response
  key: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    done(null, `${Date.now()}${fileExtension.toLowerCase()}`);
  }
});

// create the middleware
const uploadsMiddleware = multer({
  storage
}).single('image');

// the string argument to .single() is the file's field name
// it matches the <input name="file-to-upload" type="file"/>
// or the key of the FormData field you appended

module.exports = uploadsMiddleware;
