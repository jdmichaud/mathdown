const fs = require('fs');
const lodash = require('lodash');
const fetch = require('node-fetch');
const toHtml = require('@jdmichaud/markdowner');
const Mustache = require('mustache');

const Backend = function Backend(config) {
  this.config = config;

  const template = fs.readFileSync(config.template).toString('utf-8');

  this.routes = {
    '/toHtml': async (req, res, next) => {
      if (!lodash.has(req.query, 'url')) {
        res.status(400);
        next();
      }
      const response = await fetch(req.query.url);
      try {
        const html = await toHtml(response.text());
        const page = Mustache.render(template, {
          title: req.query.url,
          html,
        });
        res.send(page);
      } catch (e) {
        console.log(e);
        if (e.name === 'ParseError') {
          res.send(e.message);
        }
      }
    },
  };

  return this;
};

module.exports = Backend;
