const express = require('express');
const morgan = require('morgan');
const lodash = require('lodash');
const Backend = require('./backend');

const Server = function Server(config) {
  this.config = config;

  // Create the Express application
  const app = express();
  app.disable('x-powered-by');
  // For logging
  if (config.logging_enabled) {
    app.use(morgan('combined'));
  }
  // For CORS
  if (config.cors_enabled) {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

      // intercepts OPTIONS method
      if (req.method === 'OPTIONS') {
        // respond with 200
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  // Serving static folder
  app.use(express.static(config.static_path));

  // The routes
  this.backend = new Backend(config);
  lodash.forIn(this.backend.routes, (handler, route) => app.get(route, handler));

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    next(err);
  });
  app.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).send({ error: 'Server Error' });
  });

  this.listen = () => {
    app.listen(this.config.port, this.config.host, () => {
      console.log(`server listening on http://${config.host}:${config.port}/`);
    });
  };

  return this;
};

module.exports = Server;
