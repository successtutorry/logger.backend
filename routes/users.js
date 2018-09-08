feaconst express = require('express');
const router = express.Router();



router.route('/index')
  .get((req, res) => {
    res.render('index');
  });
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
module.exports = router;