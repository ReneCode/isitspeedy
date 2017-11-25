
var fs = require('fs');
const path = require('path');

var express = require('express');

var router = express.Router();

const executeRoute = require('./execute-route')
const logRoute = require('./log-route')

const getConfig = (req, res) => {
  res.send("this is my config")
}


router.get("/config", getConfig);

router.use("/execute", executeRoute);
router.use("/log", logRoute);

module.exports = router;



