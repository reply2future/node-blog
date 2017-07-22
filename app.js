const express = require('express');

const http = require('http');
const path = require('path');

const index = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', index);

module.exports = app;


