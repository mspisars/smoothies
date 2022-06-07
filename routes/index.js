var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Smoothie Man!', memo: 'Kind of like the candy man, but smooth!' });
});

module.exports = router;
