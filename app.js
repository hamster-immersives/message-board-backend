var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');

var mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/users');
var postRouter = require('./routes/post/post');

var app = express();

mongoose
   .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('MONGODB CONNECTED!'))
   .catch(err => console.log(err));
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userJWTStrategy = require('./routes/passport/passport-user-jwt');

app.use(passport.initialize());

passport.serializeUser((user, cb) => {
  console.log('32 -------')
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log('37 -------')
  cb(null, user);
});

passport.use('jwt-user', userJWTStrategy);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/post', postRouter)
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
