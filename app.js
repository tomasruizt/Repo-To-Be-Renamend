var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var accounts = require('./routes/data');

var chainPal = require('./gdaxFunctions/chainPal');
var customer = require('./gdaxFunctions/customer');

const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
//app.use('/api/', post);

app.get('/login', function(req,res){
  res.sendfile(__dirname + '/public/login.html');
});

app.get('/api', function(req,res){
  publicClient
  .getProducts()
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    // handle the error
  });
})

const key = 'key';
const secret = 'secret';
const passphrase = 'passphrase';

const apiURI = 'https://api.gdax.com';
const sandboxURI = 'https://api-public.sandbox.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  apiURI
);

app.get('/show', function(req, res, next){
  customer.getAccountBalance().then(function(result){
    console.log(result)
    res.render("currency", {
      user: {"username": "Kajetan"},
      accounts: result
    })
  }).catch(function(error){
    console.log('error')
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
