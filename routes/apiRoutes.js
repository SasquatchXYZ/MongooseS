const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = app => {
  app.get('/scrape', (req, res) => {
    axios.get('http://www.echojs.com/').then(response => {
      // console.log(response.data);
      const $ = cheerio.load(response.data);
      $('article h2').each(function (i, element) {
        const result = {};

        result.title = $(this)
          .children('a')
          .text();
        result.link = $(this)
          .children('a')
          .attr('href');

        db.Article.create(result)
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(err => res.json(err))
      });
      console.log('Scrape Complete');
      res.send('Scrape Complete')
    })
  });

  app.get('/articles', (req, res) => {
    console.log('loading...');
    db.Article.find({})
      .then(dbArticles => res.render('index',dbArticles))
      .catch(err => res.json(err))
  });
};