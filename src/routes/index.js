var express = require('express');
var router = express.Router();
var dogRoutes = require('../dog/dog.route')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

router.use('/dog',dogRoutes);

module.exports = router;
