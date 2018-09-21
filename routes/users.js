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
  router.route('/profile')
  .get((req, res) => {
    res.render('profile');
  });
 router.route('/personal')
  .get((req, res) => {
    res.render('personal');
  });

  router.route('/overlayform')
  .get((req, res) => {
    res.render('overlayform');
  });
   router.route('/education')
  .get((req, res) => {
    res.render('education');
  });
   router.route('/work')
  .get((req, res) => {
    res.render('work');
  });
   router.route('/teaching')
  .get((req, res) => {
    res.render('teaching');
  });

module.exports = router;