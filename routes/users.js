var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/:code', function(req, res, next) {
  var id = req.params.code;
  res.send('respd with a resource'+ id);
});

module.exports = router;
