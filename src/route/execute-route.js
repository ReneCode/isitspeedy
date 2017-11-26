
var express = require('express');
var router = express.Router();
const axios = require('axios');

const executeService = require('../service/execute-service')


router.post("/", (req, res) => {
  const config = req.body

  const mode = req.query.mode || 'detail';
  executeService.execute(requests, clients)
    .then(results => {
      return executeService.aggregateResults(results, mode);
    })
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.status(400).send("error:" + err);
    });
});

module.exports = router;
