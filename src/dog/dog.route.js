var express = require('express');
var dogCtrl = require('./dog.controller');

const router = express.Router();

router.get('/',dogCtrl.getAll);
router.post('/',dogCtrl.filter)

module.exports = router;