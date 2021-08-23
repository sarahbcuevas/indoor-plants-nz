var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var config = require('../config');

// const S3_BUCKET = process.env.S3_BUCKET;
const S3_BUCKET = config.S3_BUCKET;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-s3', function(req, res, next) {
  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
  });
  const fileName = req.query['file-name'].replace(/ /g, "_");
  const fileType = req.query['file-type'];

  const s3Params = {
    'Bucket': S3_BUCKET,
    'Key': fileName,
    'Expires': 60,
    'ContentType': fileType,
    'ACL': 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    res.write(JSON.stringify(returnData));
    res.end();
  });
});

router.delete('/sign-s3', function(req, res, next) {
  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
  });

  const fileName = req.query['file-name'];

  const s3Params = {
    'Bucket': S3_BUCKET,
    'Key': fileName
  };

  s3.deleteObject(s3Params, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });

});

module.exports = router;
