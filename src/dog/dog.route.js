var express = require('express');
var dogCtrl = require('./dog.controller');

const router = express.Router();

router.get('/',dogCtrl.getAll);
router.delete('/:id',dogCtrl.delete);
router.post('/',dogCtrl.add);
router.post('/filter',dogCtrl.filter);
router.put('/',dogCtrl.update);
router.put('/adopted/',dogCtrl.adopted);

module.exports = router;