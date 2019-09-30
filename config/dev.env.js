var merge = require('webpack-merge');
var prodEnv = require('./prod.env');
var fs = require('fs')

// Allow developers to locally override the git-committed configs
var localEnv = {}
if (fs.existsSync(__dirname + '/local.env.js')) {
  localEnv = require('./local.env');
  console.info('Overriding config with `local.env` file')
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // CCE
  PROJECT_ID: '"60dc05dc-9ab4-40c8-b224-b7ca59c4fc4b"',
  //PROJECT_SETTINGS: JSON.stringify(JSON.parse(fs.readFileSync('./config/projects/cce/project-settings.json', 'utf8'))),

  // KRYPTOSTACK
  // PROJECT_ID: '"10dc05dc-9ab4-40c8-b224-b7ca59c4fc4b"',
  // PROJECT_SETTINGS: JSON.stringify(JSON.parse(fs.readFileSync('./config/projects/kryptostack/project-settings.json', 'utf8'))),

  // XBASE
  // PROJECT_ID: '"31900b3c-f4b5-4cfc-a512-b14392e447ca"',
  // PROJECT_SETTINGS: JSON.stringify(JSON.parse(fs.readFileSync('./config/projects/xbase/project-settings.json', 'utf8'))),

  //TRADERONE
  // PROJECT_ID: '"ed87f33e-884e-11e9-bc42-526af7764f64"',
  // PROJECT_SETTINGS: JSON.stringify(JSON.parse(fs.readFileSync('./config/projects/traderone/project-settings.json', 'utf8'))),

  // API_LOCATION: '"http://localhost:3000/"',
  API_LOCATION: '"https://staging-2-cce-api.chaincreator.exchange/"',
  API_LOCATION_AUTH: '"https://staging-2-cce-api.chaincreator.exchange/"',
  API_LOCATION_ANALYTICS: '"https://analytics-api-staging.chaincreator.exchange"',
  ICONS_LOCATION: '"https://s3-eu-west-1.amazonaws.com/cce-resources/coins/"',
  AWS_ENDPOINT: '"a1jfeir1dfiyki-ats.iot.eu-west-1.amazonaws.com"',
  AWS_REGION: '"eu-west-1"',
  AWS_ID: '"AKIAILZWMEZ5IH7Q3JGQ"',
  AWS_SECRET: '"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"',
  ROLLBAR_CLIENT_ACCESS_TOKEN: `""`,
}, localEnv);
