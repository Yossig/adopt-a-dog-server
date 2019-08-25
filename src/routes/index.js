var express = require('express');
var router = express.Router();
var dogRoutes = require('../dog/dog.route')
var breedRoutes = require('../breed/breed.route')
var statisticsRoutes = require('../statistics/statistics.route')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

router.use('/dog',dogRoutes);
router.use('/breed',breedRoutes);
router.use('/statistics',statisticsRoutes);

module.exports = router;
