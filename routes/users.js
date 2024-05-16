var express = require('express');
const winston = require("winston");
var router = express.Router();

const logger = winston.createLogger();

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info(`reciving request: ${req}`);
  res.send('respond with a resource');
});

module.exports = router;
