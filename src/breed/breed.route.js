var express = require('express');
var breedCtrl = require('./breed.controller');

const router = express.Router();

router.get('/', breedCtrl.getAll);
router.post('/filter', breedCtrl.filter);

module.exports = router;