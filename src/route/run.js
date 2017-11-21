
var express = require('express');
var router = express.Router();
const axios = require('axios');

const executeRequest = require('../execute-request/execute-request');

const run = (req, res) => {
  const config = req.body
  console.log(config)

  let requests = config.requests
  if (requests && Array.isArray(requests) && requests.length > 0) {
    executeRequest.execute(requests)
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        res.status(400).send("error:" + err);
      });


  } else {
    res.status(404).send("'sequence' data missing");
  }

/*

  let url = 'http://localhost:8000/'
  url = 'https://cs2-projectviewerservice-dev.azurewebsites.net/';

  const timeStart = new Date();
  axios.get(url)
    .then(response => {
      const timeEnd = new Date();
      const timeDiff = timeEnd - timeStart;
      console.log(timeDiff)
      res.send("response after " + timeDiff + " ms")
    })
    .catch(err => {
      res.send("error:" + err)
    })
    */
}

router.post("/", run);

module.exports = router;
