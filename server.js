const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = process.env.PORT || 8080;

// Use Morgan Logger for Logging Requests
app.use(logger('dev'));
// Use Body-Parse for handling form submissions.
app.use(bodyParser.urlencoded({extended: true}));
// Use Express.static to serve up the public folder as a static directory.
app.use(express.static('public'));

// Establishing Handlebars as the Templating Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect to the MongoDB Database
mongoose.connect('mongodb://localhost/mongooseSC', {useNewURLParser: true});

// Start the Server
app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));