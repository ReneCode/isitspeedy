
var express = require('express');
var router = express.Router();
const axios = require('axios');

const executeService = require('../service/execute-service')


router.post("/", (req, res) => {
  const config = req.body
  console.log(config)

  let requests = config.requests;
  let clients = config.clients || 1;
  const mode = req.query.mode || 'detail';
  if (requests && Array.isArray(requests) && requests.length > 0) {
    executeService.runMultiClients(requests, clients)
      .then(results => {
        return executeService.aggregateResults(results, mode);
      })
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).send("error:" + err);
      });
  } else {
    res.status(404).send("'requests' missing");
  }

});

module.exports = router;
