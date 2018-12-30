const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const app = express();
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

/*require('./routes/htmlRoutes')(app);
require('./routes/apiRoutes')(app);*/

// Connect to the MongoDB Database
mongoose.connect('mongodb://localhost/week18test', {useNewUrlParser: true});

// Routes --------------------------------------------------------------------------------------------------------------
app.get('/scrape', (req, res) => {
  axios.get('https://lifehacker.com/tag/programming').then(response => {
    console.log(response.data);
    const $ = cheerio.load(response.data);
    $('div.item__text').each(function (i, element) {
      const result = {};

      result.title = $(this).find('h1').text();
      result.link = $(this).find('h1').children().attr('href');
      result.author = $(this).find('div.author').text();
      result.exerpt = $(this).find('div.excerpt').text();

      db.Article.create(result)
        .then(dbArticle => console.log(dbArticle))
        .catch(err => res.json(err))
    });
    console.log('Scrape Complete');
    res.send('Scrape Complete')
  })
});

app.get('/articles', (req, res) => {
  db.Article.find({})
    .then(dbArticle => {
      console.log(dbArticle);
      res.render('index', {articles: dbArticle})})
    .catch(err => res.json(err))
});

app.get('/articles/:id', (req, res) => {
  db.Article.findOne({_id: req.params.id})
    .populate('note')
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
});

app.post('/articles/:id', (req, res) => {
  db.Note.create(req.body)
    .then(dbNote => db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true}))
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
});


// Start the Server
app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));