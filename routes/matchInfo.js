var express = require('express');
var router = express.Router();
var matchInfoCtrl = require('../controllers/matchInfo-controller');

router.get('/:id', matchInfoCtrl.show);

module.exports = router;