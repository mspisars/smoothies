var express = require('express');
var router = express.Router();
const passport = require('passport');
// const db = require('../models');

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  console.log("get Users", req.user);
  res.json(req.user.toJSON());
});

module.exports = router;
