
var fs = require('fs');
const path = require('path');

var express = require('express');

var router = express.Router();

const runRoute = require('./run-route')
const logRoute = require('./log-route')

const getConfig = (req, res) => {
  res.send("this is my config")
}


router.get("/config", getConfig);

router.use("/run", runRoute);
router.use("/log", logRoute);

module.exports = router;



