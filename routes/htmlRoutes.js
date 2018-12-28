const db = require('../models');

module.exports = app => {
  app.get('/', (req, res) => res.render('index'));
  //app.get('/articles', (req, res) => res.render('index'))
};