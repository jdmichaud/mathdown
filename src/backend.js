const fs = require('fs');
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
      // Because latex2js does not work without a DOM, rendering in the backend
      // is not possible anymore.
      // '/toHtml': async (req, res, next) => {
      //   if (!lodash.has(req.query, 'url')) {
      //     res.status(400);
      //     next();
      //   }
      //   const response = await fetch(req.query.url);
      //   try {
      //     const html = await toHtml(response.text());
      //     const page = Mustache.render(template, {
      //       title: req.query.url,
      //       html,
      //     });
      //     res.send(page);
      //   } catch (e) {
      //     console.log(e);
      //     if (e.name === 'ParseError') {
      //       res.send(e.message);
      //     }
      //   }
      // },
      // Full page render in the frontend because of latex2js
      '/toHtml': async (req, res, next) => {
        if (!lodash.has(req.query, 'url')) {
          res.status(400);
          next();
        }
        res.sendFile('tohtml.html', {
          root: config.static_path,
        });
      },
      '/[0-9a-z]+': async (req, res) => {
        res.sendFile('index.html', {
          root: config.static_path,
        });
      },
      '/file/[0-9a-z]+': async (req, res) => {
        const uid = req.url.substr(1);
        if (cache[uid] === undefined) {
          cache[uid] = '';
        }
        res.send(cache[uid]);
      },
    },
    posts: {
      '/file/[0-9a-z]+': async (req, res) => {
        const uid = req.url.substr(1);
        cache[uid] = req.body.content;
        res.sendStatus(200);
      },
    },
  };

  return this;
};

module.exports = Backend;
