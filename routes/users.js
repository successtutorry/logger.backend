const express = require('express');
const router = express.Router();
const Joi = require('joi');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');

const ContactusForm = require('../models/contactusform');
const tutor = require('../models/tutors');



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
    tutor.find( { }, function(err, docs){
      var tutorChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          tutorChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('find_tutor', {  tutors: tutorChunks });
      
    });
   
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
      const contact_message = result.value.message;
      if (result.error) {
          console.log(result.error);
        
        res.redirect('/users/contacts');
      
      }

      const newContact = new ContactusForm(result.value); 
      console.log('newContact', newContact);
      newContact.save();

      const html = `Hi there,
      <br/>
      Thank you for contacting us 
      </br></br>     
      We have recieved your message.
      </br>
      <b>${contact_message}</b>
      <br/>     
      We will reach back to you soon.
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      mailer.sendEmail('tutorry.in@gmail.com', result.value.email, 'Message', html);
      res.redirect('/users/contacts');


  });


module.exports = router;