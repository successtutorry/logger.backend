const express = require('express');
const router = express.Router();
const Joi = require('joi');

const ContactusForm = require('../models/contactusform');



// Validation Schema, validationg the fields which user is entering

const contactusSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  message: Joi.string().required()
  
});







router.route('/inner')
  .get((req, res) => {
    res.render('news');
  });

  router.route('/features')
  .get((req, res) => {
    res.render('features');
  });
router.route('/find_tutor')
  .get((req, res) => {
    res.render('find_tutor');
  });

router.route('/become_tutor')
  .get((req, res) => {
    res.render('become_tutor');
  });

  router.route('/contacts')
  .get((req, res) => {
    res.render('contacts');
  }).post((req, res) => {
    
      const result = Joi.validate(req.body, contactusSchema);
      if (result.error) {
          console.log(result.error);
        
        res.redirect('/users/contacts');
      
      }

      const newContact = new ContactusForm(result.value); 
      console.log('newContact', newContact);
      newContact.save();
      res.redirect('/users/contacts');


  });


module.exports = router;