var express = require('express');
var dogCtrl = require('./dog.controller');

const router = express.Router();

router.get('/',dogCtrl.getAll);
router.post('/',dogCtrl.filter);
router.delete('/:id',dogCtrl.delete);
router.post('/add',dogCtrl.add);

module.exports = router;