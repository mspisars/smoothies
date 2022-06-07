const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

router.post('/', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    console.log('login', err, user, info);
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info);
      res.send(info);
    } else {
      console.log('login -USER *********', req.user);

      req.logIn(user, err => {
        db.User.findOne({
          where: {
            username: user.username,
          },
        }).then(user => {
          const token = jwt.sign({ id: user.id, username: user.username }, jwtConfig.secret, { 
            expiresIn: '2 days'
          });
          
          console.log('token', token, req.user);

          res.status(200).send({
            auth: true,
            token: token,
            username: user.username,
            message: 'user authenticated',
          });
        });
      });
    }
  })(req, res, next);
});

module.exports = router;
