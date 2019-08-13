var express = require('express');
var breedCtrl = require('./breed.controller');

const router = express.Router();

router.get('/',breedCtrl.getAll);

module.exports = router;