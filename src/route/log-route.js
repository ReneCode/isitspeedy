
var express = require('express');
var router = express.Router();

let logService = require('../service/log-service');


router.post("/data/:key", (req, res) => {
  const key = req.params.key;
  const val = Number.parseFloat(req.query.val);

  if (Number.isNaN(val)) {
    return res.status(400).send();
  }

  logService.addData(key, val)
    .then(id => {
      res.send(id);
    })
    .catch(err => {
      res.status(400).send();
    });
});


router.get("/data/:key", (req, res) => {
  const key = req.params.key;

  logService.getData(key)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).send();
    });
});

module.exports = router;
