const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

router.post('/', (req, res, next) => {
  passport.authenticate('login', { session: false }, async (err, user, info) => {
    console.log('login', err, user, info);
    if (err) {
      console.log(err);
      next(err);
    }
    if (!user) {
      const form = { ...req.body };
      console.log(info, form);
      if (info.clear && form.isRegister) {
        user = await db.User.create({
          username: form.username,
          password: form.password,
          email: form.email
        });
        console.log(user);
      }
      else {
        res.send(info);
      }
    }
    if (user) {
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
