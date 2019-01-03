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
        // If the number of articles is not 0...
        // if (dbArticle.length !== 0) {

          // Create Article Array with the Titles
          const articleArray = [];
          dbArticle.forEach(article => articleArray.push(article.title));

          console.log(articleArray);
          console.log(articleArray.length);

          axios.get('https://lifehacker.com/tag/programming').then(response => {
            let newArticleCounter = 0;

            const $ = cheerio.load(response.data);
            $('div.item__text').each(function (i, element) {

              const result = {};

              result.title = $(this).find('h1').text();
              result.link = $(this).find('h1').children().attr('href');
              result.author = $(this).find('div.author').text();
              result.exerpt = $(this).find('div.excerpt').text();

              // If the articles scraped are not in the Array..
              if (!articleArray.includes(result.title)) {
                // Increment Counter
                newArticleCounter++;
                // Save them to the database
                db.Article.create(result)
                  .then(dbArticle => {
                    console.log(dbArticle);
                    //res.send({message: `Scrape Completed. ${newArticleCounter} New Articles Available to View.`})
                    //res.send(200, {message: `Scrape Complete, ${newArticleCounter} New Articles Available`})
                  })
                  .catch(err => console.log(err))
              } else {
                console.log('Article Already Scraped.');
              }
            });
          })

          // If the number of articles is 0
/*        } else {
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
                  res.send({message: `Scrape Completed. ${newArticleCounter} New Articles Available to View.`})
                })
                .catch(err => console.log(err))
            });
          })
        }*/
      })
      .catch(err => res.json(err))
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
