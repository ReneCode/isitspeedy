
var fs = require('fs');
const path = require('path');

var express = require('express');

var router = express.Router();

const runRouter = require('./run')

const getConfig = (req, res) => {
  res.send("abc")
}


router.get("/config", getConfig);

router.use("/run", runRouter);

module.exports = router;



