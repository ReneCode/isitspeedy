
var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
	res.send("is it speedy - backend");
})

module.exports = router;

