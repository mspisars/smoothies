const passport = require('passport');

const authenticate = function (req, res, next) {
  console.log('in ************** authenticate', req, res, next);

  return passport.authenticate('jwt', { session: false }, function (err, user, info) {
    console.log('in ** authenticate', err, user, info);
    if (err) { next(err); }
    if (!user) {
      // code if failed here
      res.json({
          status: 401,
          message: "authentication expired",
          data: null
        }
      );
    }
    next();
  })
};

module.exports = {
  authenticate
}
