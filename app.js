var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
var cors = require('cors');
var config = require('./config');
var aws = require('aws-sdk');

var indexRouter = require('./routes/indexRouter');
var productRouter = require('./routes/productRouter');
var categoryRouter = require('./routes/categoryRouter');
var usersRouter = require('./routes/userRouter');
var contentRouter = require('./routes/contentRouter');
var contactRouter = require('./routes/contactRouter');
var socialMediaRouter = require('./routes/socialMediaRouter');
var sendMailRouter = require('./routes/sendMailRouter');
var refreshRouter = require('./routes/refreshRouter');
var customerRouter = require('./routes/customerRouter');
var orderRouter = require('./routes/orderRouter');
var settingsRouter = require('./routes/settingsRouter');
var orderTransactionRouter = require('./routes/orderTransactionRouter');

aws.config.loadFromPath('./aws_config.json');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB Connected!'))
.catch(err => {
  console.log('DB Connection Error: ', err.message);
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected correctly to server');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// CORS config
var corsOptions = {
  'origin': [
    'https://www.indoorplantsnz.com',
    'http://www.indoorplantsnz.com',
    'http://localhost:4200',
    'https://indoor-plants-nz-assets.s3.ap-southeast-2.amazonaws.com/'
  ],
  'optionsSuccessStatus': 200,
  'credentials': true,
  'methods': ['GET', 'POST', 'PUT', 'DELETE'],
  'allowedHeaders': ['Content-Type', 'x-access-token', 'Authorization']
};
app.use(cors(corsOptions));

// passport config
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/content', contentRouter);
app.use('/contact', contactRouter);
app.use('/socialmedia', socialMediaRouter);
app.use('/send', sendMailRouter);
app.use('/customer', customerRouter);
app.use('/order', orderRouter);
app.use('/orderTransaction', orderTransactionRouter);
app.use('/settings', settingsRouter);
/** WARNING: Disable this on Production Environment */
app.use('/refresh', refreshRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
