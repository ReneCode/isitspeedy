
var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
	const msg = `<h1>is it speedy</h1>
	<p>Syntax: /api/execute?mode=[details|summary]</p>
	
	post data:
	<pre>
	{
		"requests": [
			"http://google.com",
			"http://bing.com"
		],
		"header": {
			"authorization": "abc"
		},
		"clients": 4
	}
	</pre>
	`
	res.send(msg);
})

module.exports = router;

