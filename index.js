#!/usr/bin/env node
const fs = require('fs');
const yaml = require('js-yaml');
const lodash = require('lodash');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const constants = require('./src/constants');
const defaultConfig = require('./src/default-config');
const Server = require('./src/server');

const optionDefinitions = [
  { name: 'host', alias: 'i', type: String },
  { name: 'port', alias: 'p', type: Number },
  {
    name: 'config',
    alias: 'c',
    type: String,
    defaultValue: constants.DEFAULT_CONFIG
  },
  { name: 'help', alias: 'h' }
];

const options = commandLineArgs(optionDefinitions);
// User requested some help
if (lodash.has(options, 'help')) {
  console.log(getUsage([{
    header: 'usage',
    optionList: optionDefinitions
  }]));
  process.exit(0);
}
// Load config
let config;
try {
  config = yaml.safeLoad(fs.readFileSync(options.config, 'utf8'));
} catch (e) {
  console.error(`error: could not load the config file ${options.config}: ${e}`);
  process.exit(2);
}

// Prioritize command line options, then config file and then default
config = lodash.merge({}, defaultConfig, config, options);

if (config.port < 0 || config.port > 65535) {
  console.error('error: port should be between 0 and 65535');
  process.exit(1);
}
const server = Server(config);
server.listen();
