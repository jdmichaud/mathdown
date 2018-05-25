const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const fetch = require('node-fetch');
const toHtml = require('@jdmichaud/markdowner');
const Mustache = require('mustache');

const Backend = function Backend(config) {
  this.config = config;

  const template = fs.readFileSync(config.template).toString('utf-8');

  const cache = {};

  this.routes = {
    gets: {
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
      '/[0-9a-z]{32}': async (req, res) => {
        const projectRoot = path.join(
          path.dirname(require.main.filename),
          config.static_path);
        res.sendFile('index.html', {
          root: projectRoot,
        });
      },
      '/file/[0-9a-z]{32}': async (req, res) => {
        const uid = req.url.substr(1);
        if (cache[uid] === undefined) {
          cache[uid] = '';
        }
        res.send(cache[uid]);
      },
    },
    posts: {
      '/file/[0-9a-z]{32}': async (req, res) => {
        const uid = req.url.substr(1);
        cache[uid] = req.body.content;
        res.sendStatus(200);
      },
    },
  };

  return this;
};

module.exports = Backend;
