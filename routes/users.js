
console.log('entered user.js');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');
var url = require('url');
const bodyParser = require('body-parser');
 
const ContactusForm = require('../models/contactusform');
const tutor = require('../models/tutors');



// Validation Schema, validationg the fields which user is entering

const contactusSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  message: Joi.string().required()
  
});



router.route('/maths')  
  .get((req, res) => {
   
    tutor.find( {subjects:['Maths']}, function(err, docs){
      var biologyChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          biologyChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('find_tutor', {  tutors: biologyChunks });
      
    });
  });

 /* router.route('/sort')
  .get((req,res) => {

    console.log('abc')
    console.log(req.searchParams.get('orderby'));
    res.render('find_tutor');

  });*/

  router.route('/gettutors')
  .get((req,res) =>{

    const subject = req.query.n;

     tutor.find( {subjects:subject}, function(err, docs){
      var subjectChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          subjectChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('find_tutor', {  tutors: subjectChunks });
      
    });

   
    
  });


router.route('/inner')
  .get((req, res) => {
    res.render('news');
  });

  router.route('/login')
  .get((req, res) => {
    res.render('login');
  });

  router.route('/register')
  .get((req, res) => {
    res.render('register');
  });

  router.route('/features')
  .get((req, res) => {
    res.render('features');
  });

router.route('/find_tutor')
  .get((req, res, next) => { 


            tutor.find( {$or: [{subjects:req.query.n}, {zipcode:req.query.z}]}, function(err, docs){
            var tutorChunks = [];
            var chunkSize = 3;
            for(var i=0; i < docs.length; i+= chunkSize){
                tutorChunks.push(docs.slice(i, i+chunkSize));
            }
              res.render('find_tutor', {  tutors: tutorChunks });
            
          }).sort({price:-1});

  });

  router.route('/maths')
  .get((req, res, next) => { 


            tutor.find( {subjects:['Maths']}, function(err, docs){
            var tutorChunks = [];
            var chunkSize = 3;
            for(var i=0; i < docs.length; i+= chunkSize){
                tutorChunks.push(docs.slice(i, i+chunkSize));
            }
              res.render('find_tutor', {  tutors: tutorChunks });
            
          }).sort({price:-1});

  });

  router.route('/chemistry')
  .get((req, res, next) => { 


            tutor.find( {subjects:['Science'], location:'Thane'}, function(err, docs){
            var tutorChunks = [];
            var chunkSize = 3;
            for(var i=0; i < docs.length; i+= chunkSize){
                tutorChunks.push(docs.slice(i, i+chunkSize));
            }
              res.render('find_tutor', {  tutors: tutorChunks });
            
          }).sort({price:-1});

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

console.log('leaving users.js');

