const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
const moment = require('moment');

module.exports = app => {
  // Scraping Articles Route -------------------------------------------------------------------------------------------
  app.get('/api/scrape', (req, res) => {
    console.log('scrape');

    db.Article.find({})
      .then(dbArticle => {

        // Create Article Array with the Existing Articles in the Database
        const articleArray = [];
        dbArticle.forEach(article => articleArray.push(article.title));

        // console.log(articleArray);
        // console.log(articleArray.length);

        axios.get('https://lifehacker.com/tag/programming').then(response => {
          let newArticleCounter = 0;

          const $ = cheerio.load(response.data);
          $('div.item__text').each(function (i, element) {

            const result = {};

            result.title = $(this).find('h1').text();
            result.link = $(this).find('h1').children().attr('href');
            result.author = $(this).find('div.author').text();
            result.excerpt = $(this).find('div.excerpt').text();

            // If the articles scraped are not in the Array..
            if (!articleArray.includes(result.title)) {
              // Increment Counter
              newArticleCounter++;
              // Save them to the database
              db.Article.create(result)
                .then(dbArticle => {
                  console.log(dbArticle);
                  // res.render('index', {message: `Scrape Completed. ${newArticleCounter} New Articles Available to
                  // View.`}) res.send(200, {message: `Scrape Complete, ${newArticleCounter} New Articles Available`})
                })
                .catch(err => console.log(err))
            } else {
              console.log('Article Already Scraped.');
            }
          });
        })
      })
      .catch(err => res.json(err))
  });

  // POST New Note and Update Article ----------------------------------------------------------------------------------
  app.post('/articles/:id', (req, res) => {

    db.Note.create(req.body)
      .then(dbNote => db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true}))
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err))
  });

  // DELETE Note and Update Article ------------------------------------------------------------------------------------
  app.delete('/articles/:id/:noteId', (req, res) => {

    db.Note.findByIdAndDelete(req.params.noteId)
      .then(dbNote => db.Article.findOneAndUpdate({_id: dbNote.articleId}, {$pull: {notes: dbNote._id}}))
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err))
  });

  // GET Single Note ---------------------------------------------------------------------------------------------------
  app.get('/notes/:id', (req, res) => {

    db.Note.findOne({_id: req.params.id})
      .then(dbNote => res.json(dbNote))
      .catch(err => res.json(err))
  });

  // POST (UPDATE) a Single Note ---------------------------------------------------------------------------------------
  app.post('/notes/:id', (req, res) => {

    db.Note.findOneAndUpdate({_id: req.params.id}, {
      $set: {
        title: req.body.title,
        body: req.body.body,
        updated: Date.now()
      }
    })
      .then(dbNote => res.json(dbNote))
      .catch(err => res.json(err))
  })


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
