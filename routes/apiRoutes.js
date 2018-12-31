const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = app => {
  // Scraping Articles Route -------------------------------------------------------------------------------------------
/*  app.get('/api/articles', (req, res) => {

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
  });*/


  app.get('/api/scrape', (req, res) => {
    console.log('scrape');

    db.Article.find({})
      .then(dbArticle => {
        if (dbArticle.length !== 0) {
          const articleArray = [];
          dbArticle.forEach(doodad => articleArray.push(doodad.title));

          console.log(articleArray);

          axios.get('https://lifehacker.com/tag/programming').then(response => {
            let newArticleCounter = 0;

            const $ = cheerio.load(response.data);
            $('div.item__text').each(function (i, element) {

              const result = {};

              result.title = $(this).find('h1').text();
              result.link = $(this).find('h1').children().attr('href');
              result.author = $(this).find('div.author').text();
              result.exerpt = $(this).find('div.excerpt').text();

              if (!articleArray.includes(result.title)) {
                newArticleCounter++;
                db.Article.create(result)
                  .then(dbArticle => {
                    console.log(dbArticle);
                  })
                  .catch(err => console.log(err))
              }
            });
            res.send({message: `Scrape Completed. ${newArticleCounter} New Articles Available to View.`})
          })

        } else {
          axios.get('https://lifehacker.com/tag/programming').then(response => {
            let newArticleCounter = 0;

            const $ = cheerio.load(response.data);
            $('div.item__text').each(function (i, element) {

              const result = {};

              result.title = $(this).find('h1').text();
              result.link = $(this).find('h1').children().attr('href');
              result.author = $(this).find('div.author').text();
              result.exerpt = $(this).find('div.excerpt').text();

              db.Article.create(result)
                .then(dbArticle => {
                  newArticleCounter++;
                  console.log(dbArticle);
                })
                .catch(err => console.log(err))
            });
            res.send({message: `Scrape Completed. ${newArticleCounter} New Articles Available to View.`})
          })
        }
      })
      .catch(err => res.json(err))


    /*axios.get('https://lifehacker.com/tag/programming').then(response => {
      let newArticleCounter = 0;

      const $ = cheerio.load(response.data);
      $('div.item__text').each(function (i, element) {

        const result = {};

        result.title = $(this).find('h1').text();
        result.link = $(this).find('h1').children().attr('href');
        result.author = $(this).find('div.author').text();
        result.exerpt = $(this).find('div.excerpt').text();

        if (!articleArray.includes(result.title)) {
          newArticleCounter++;
          articleArray.push(result.title);
          db.Article.create(result)
            .then(dbArticle => {
              console.log(dbArticle);
            })
            .catch(err => res.render('index', {message: err}))
        }
      });
      res.send({message: `Scrape Completed. ${newArticleCounter} New Articles Available to View.`})
    })*/
  });


  /*    axios.get('https://lifehacker.com/tag/programming').then(response => {

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
    })*/
};
