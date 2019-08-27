var express = require('express');
var statisticsCtrl = require('./statistics.controller');

const router = express.Router();

router.get('/lastClient', statisticsCtrl.getLastClient);
router.get('/hitCount', statisticsCtrl.getHitCount)
router.get('/connectedClients',statisticsCtrl.getNumberOfConnectedClients);
router.get('/',statisticsCtrl.getStatisticsData);

module.exports = router;