var proj = require('./project.js');
var app = require('./application.js');
var server = require('./server.js');
var deploy = require('./deploy.js');
var i18n = require('./i18n.js');

var wonkajs = global.wonkajs || {};

wonkajs.proj = proj;

wonkajs.app = app;

wonkajs.i18n = i18n;

wonkajs.server = server;

wonkajs.deploy = deploy;

global.wonkajs = wonkajs;

module.exports = wonkajs;
