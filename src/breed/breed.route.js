var express = require('express');
var breedCtrl = require('./breed.controller');

const router = express.Router();

router.get('/', breedCtrl.getAll);
router.post('/filter', breedCtrl.filter);
router.put('/',breedCtrl.update);
router.delete('/:id',breedCtrl.delete);
router.post('/',breedCtrl.add);

module.exports = router;