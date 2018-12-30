const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = app => {
  app.get('/', (req, res) => res.render('index'));

  app.get('/scrape', (req, res) => {
    axios.get('https://lifehacker.com/tag/programming').then(response => {

      const $ = cheerio.load(response.data);
      $('div.item__text').each(function (i, element) {
        const result = {};

        result.title = $(this).find('h1').text();
        result.link = $(this).find('h1').children().attr('href');
        result.author = $(this).find('div.author').text();
        result.exerpt = $(this).find('div.excerpt').text();

        db.Article.create(result)
          .then(dbArticle => console.log(dbArticle))
          .catch(err => res.render('index', {message: err}))
      });
      res.render('index', {message: 'Scrape Completed. New Articles Available to View.'})
    })
  });

  app.get('/articles', (req, res) => {
    db.Article.find({})
      .then(dbArticle => {
        if (dbArticle.length === 0){
          res.render('index', {message: 'No Articles to Display...'})
        } else {
          res.render('index', {articles: dbArticle})
        }
      })
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
  })

};