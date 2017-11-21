'use strict'

var express = require('express');
var http = require('http');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var jwt = require('express-jwt');

var routeHome = require('./route/home');
var routeApi = require('./route/api');

class WebServer {

	constructor(options) {
		if (!options) {
			throw new Error("options missing")
		}
		this.options = options;
		if (this.options.authorize === undefined) this.options.authorize = true;
		if (this.options.logging === undefined) this.options.logging = true;
	}

	listen() {
		return new Promise((resolve, reject) => {
			if (!this.options.port) {
				reject("port not set");
			}
			var api = this.server.listen(this.options.port, () => {
				resolve(api);
			});
		});
	}

	createServer() {

		var app = express();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(cors());

		if (this.options.logging) {
			app.use(logger('dev'));
		}

		app.use("/", routeHome);

		if (this.options.authorize) {
			const AUTH0_SECRET = process.env.AUTH0_SECRET;
			const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

			if (!AUTH0_SECRET || !AUTH0_AUDIENCE) {
				throw Error("Auth configuration missing.")
			}

			var authCheck = jwt({
				secret: new Buffer(AUTH0_SECRET),
				audience: AUTH0_AUDIENCE
			});
			
			app.use(authCheck);
		}
		app.use("/api/v1/", routeApi);

		this.server = http.createServer(app);

		this.server.on('close', () => {
			if (this.logging) {
				console.log("server closed");
			}
		})
	}
}

module.exports = WebServer;
