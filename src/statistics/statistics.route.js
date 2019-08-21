var express = require('express');
var statisticsCtrl = require('./statistics.controller');

const router = express.Router();

router.get('/lastClient', statisticsCtrl.getLastClient);
router.post('/update',statisticsCtrl.update);
router.post('/query',statisticsCtrl.query);

module.exports = router;