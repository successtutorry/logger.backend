const express = require('express');
const router = express.Router();


router.route('/inner')
  .get((req, res) => {
    res.render('inner');
  });

  router.route('/features')
  .get((req, res) => {
    res.render('features');
  });
router.route('/find_tutor')
  .get((req, res) => {
    res.render('find_tutor');
  })

router.route('/become_tutor')
  .get((req, res) => {
    res.render('become_tutor');
  })
  router.route('/contacts')
  .get((req, res) => {
    res.render('contacts');
  })

  router.route('/register')
  .get((req, res) => {
    res.render('register');
  });
module.exports = router;