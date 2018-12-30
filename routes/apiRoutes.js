const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = app => {
  // Scraping Articles Route -------------------------------------------------------------------------------------------
  app.get('/api/articles', (req, res) => {
    const articleArray = [];

    db.Article.find({})
      .then(dbArticle => {
        if (dbArticle.length === 0) {
          res.render('index', {message: 'No Articles to Display...'})
        } else {
          dbArticle.forEach(article => {
            console.log(article.title);
            articleArray.push(article.title);
          });
          res.send(articleArray)
        }
      })
      .catch(err => res.json(err))
  });


  app.get('/api/scrape', (req, res) => {
    console.log('scrape');
    let newArticleCounter = 0;

    axios.get('https://lifehacker.com/tag/programming').then(response => {

      const $ = cheerio.load(response.data);
      $('div.item__text').each(function (i, element) {
        const result = {};

        result.title = $(this).find('h1').text();
        result.link = $(this).find('h1').children().attr('href');
        result.author = $(this).find('div.author').text();
        result.exerpt = $(this).find('div.excerpt').text();

        db.Article.create(result)
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(err => res.render('index', {message: err}))
      });
      res.send({message: 'Scrape Completed. New Articles Available to View.'})
    })
  })
};
