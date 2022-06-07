const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./models');
const jwtConfig = require('./config/jwtConfig');


const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const sharedRouter = require('./routes/shared');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/shared', sharedRouter);

// passport setup
passport.use('login', new LocalStrategy(
  function (username, password, done) {
    if (!username || !password) return done(null, false, { message: 'User not found.' });
    db.User.findOne({ where: { username: username } }).then((user) => {
      console.log('auth-login', user, username, password);
      if (!user) { return done(null, false, { message: 'User not found.' }); }
      if (!user.verifyPassword(password)) { return done(null, false, { message: 'Invalid password.' }); }
      return done(null, user);
    }).catch((err) => done(err));
  }
));
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtConfig.secret;
passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, done) {
  console.log('** JWT handling ****', opts, jwt_payload);
  db.User.findOne({ where: { username: jwt_payload.username } }).then((user) => {
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  }).catch((err) => done(err));;
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  db.User.findByPk(id).then(function (err, user) {
    done(err, user);
  });
});
app.use(session({ secret: jwtConfig.secret, resave: false, saveUninitialized: false}));
app.use(passport.initialize());

// error message handling...
app.use(function (req, res, next) {
  var err = req.session.error || req.session.messages;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  delete req.session.messages;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});


app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

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
