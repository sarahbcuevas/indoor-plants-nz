var express = require('express');
var router = express.Router();

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const DIR = './public/images';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
let upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploads', upload.single('photo'), function(req, res) {
  if (!req.file) {
    return res.send({
      success: false
    });
  } else {
    return res.send({
      success: true,
      path: `/images/${req.file.filename}`
    });
  }
});

router.delete('/uploads/:pathName', function(req, res, next) {
  console.log(`Deleting image: ${req.params.pathName}`);
  const path = './public/images/' + req.params.pathName;
  console.log(`path: ${path}`);
  fs.unlink(path, (err) => {
    if (err) return next(err);
    console.log(`${path} was deleted`);
  });
});

module.exports = router;
