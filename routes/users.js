
console.log('entered user.js');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');
const url = require('url');
const bodyParser = require('body-parser');
const ContactusForm = require('../models/contactusform');
const tutor = require('../models/tutors');
const request = require('request');
const User = require('../models/user');
const passport = require('passport');
const randomstring = require('randomstring');
var springedge = require('springedge');

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
  type: Joi.string().required()
});


router.route('/message')
.get((req,res)=>{

  var number = '918879833819';

  console.log('message button clicked');
  var params = {
  'apikey': '6gds7p61a52v92b36d61sqem4klx2qjs', // API Key
  'sender': 'SEDEMO', // Sender Name
  'to': [
    number  //Moblie Number
  ],
  'message': 'Hi, this is a test message from TUTORRY.IN',
  'format': 'json'
};
 
springedge.messages.send(params, 5000, function (err, response) {
  if (err) {
    return console.log(err);
  }
  console.log(response);
});


});


//if user is trying to access his home page without login then he is restricted

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Sorry, but you must be registered or logged in  first!');
    res.redirect('/users/login');
  }
};

// if user is already logged in and still wants to access something which can be
// accessed only when the user is logged in then a message prompts that he is 
// already logged in

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'Sorry, but you are already logged in!');
    res.redirect('/');
  } else {
    return next();
  }
};


/*router.route('/forgotPass')
.get(isNotAuthenticated,(req,res)=>{

  res.render('passwordRecovery');

}).post(isNotAuthenticated,(req,res)=>{

var emailId = req.body.email;

const userExists = User.findOne({'email': req.body.email});

if(userExists){


  const link = "http://127.0.0.1:4000/users/changePassword?email="+req.body.email;
     
     
       const html = `
      Please click on the following link to reset your password
      <br/>
      <br/>
       <a href="${link}">please click this</a>
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      mailer.sendEmail('tutorry.in@gmail.com', req.body.email, '', html);

      res.redirect('/users/login');
}

else{

  console.log('user does not exists or incorrect email id...');
}

});

router.route('/changePassword')
.get((req,res)=>{

  console.log(req.query.email);
  res.render('resetPassword');

}).post((req,res)=>{

  if(req.body.password==req.body.confirmationPassword){


    const hashed = User.hashPassword(req.body.password);

  const changedPassword =  User.updateOne(
  { email: req.query.email },
  {
    $set: { password: hashed }
   
  }

  );

  

  if(changedPassword){
    res.redirect('login');
    return;
  }
  else{

    console.log('some error in changing password');
  }

}

});*/


// this route is executed when the user clicks the signup button or directly 
// puts register link in the browser.

router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema);
      if (result.error) {
  console.log(result.error);
        req.flash('error', 'Data is not valid. Please try again.');
        res.redirect('/users/register');
        return;
      }


      // When new user is registering , the email he puts is checked if 
      // that email is registered with some other user.
      const user = await User.findOne({ 'email': result.value.email });
      console.log(user);
      if (user) {
        req.flash('error', 'Email is already in use. Please check your email');
        res.redirect('/users/register');
        return;
      }

      // password is hashed so that is not visible to anyone the way the user inputs 


      const hash = await User.hashPassword(result.value.password);

      // Generate secret token while registeration which will be used for account verification

      const secretToken = randomstring.generate();
      console.log('secretToken', secretToken);


      // secret code generated while registration is Saved to the DB

      result.value.secretToken = secretToken;

      // Flag account as inactive while registeration to restrict him from not accessing 
      // without account verification, Once the account is verified it is set back to true.
      result.value.active = false;

      // Save user to DB
      // We dnt need confirm password and password both to be save in the  database so it 
      // deleted before entering the details in the DB
      delete result.value.confirmationPassword;
      result.value.password = hash;
      const newUser = await new User(result.value); 
      console.log('newUser', newUser);
      await newUser.save();

      // Compose email After the details are saved in the database
      //this is the email which will be send to the user
       const link = "http://127.0.0.1:4000/users/verify?id="+result.value.secretToken;
     
     
       const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
       <a href="${link}">please click on the link</a>
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      await mailer.sendEmail('tutorry.in@gmail.com', result.value.email, '', html);

 

      req.flash('success', 'An email verification code has been sent to you email account, Please check your email and click on the link to complete registration');
      res.redirect('/users/login');

    } catch(error) {
      next(error);
    }
  });

 
  


 /*router.route('/verify')
  .get(isNotAuthenticated,(req,res)=>{

    console.log('request recieved');
    const token = req.query.id;
    console.log(token);

  const activated =  User.update(
  { secretToken: token },
  {
    $set: { 'username': "suri" }
   
  }

  );

  console.log(activated);

  if(activated){
    res.redirect('login');
    return;
  }
  else{

    console.log('some error in verification');
  }

});*/

router.route('/verify')
  .get((req,res)=>{
     console.log('request recieved');
    const token = req.query.id;
    User.updateOne(
  { secretToken: token },
  {
    $set: { active: true }
   
  },function(err,res){
     if(err){
      throw err;
    }
    else{
      res.redirect('/users/login');
      return;
    }
  }
);
   });



  // this route is executed when the user tries to login

router.route('/login')
  .get(isNotAuthenticated, (req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }));


  router.route('/dashboard')
  .get(isAuthenticated,(req,res)=>{

    res.render('dashboard');

  });


  router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out. Hope to see you soon!');
    res.redirect('/');
  });




var URL = "https://www.ipapi.co/json";
var city ;

request({

  url: URL,
  json: true
},(err,res,body) => {

  if(err){
    console.log(err);
  }
  else{

    city = body.city;
     
  }

});

              router.route('/gettutors')
              .get((req, res) => {

              if (req.query.n&&req.query.z){

                   console.log('display subect and zipcode');
                   tutor.find( {subjects:req.query.n, zipcode:req.query.z}, function(err, docs){
                    var subjectChunks = [];
                    var chunkSize = 3;
                    for(var i=0; i < docs.length; i+= chunkSize){
                        subjectChunks.push(docs.slice(i, i+chunkSize));
                    }
                      res.render('find_tutor', {  tutors: subjectChunks });
                    
                  }).sort({price:+1});

             }

             
            
             else if(req.query.n){

              console.log('display subject');
               tutor.find( {subjects:req.query.n,location:city}, function(err, docs){
                var subjectChunks = [];
                var chunkSize = 3;
                for(var i=0; i < docs.length; i+= chunkSize){
                    subjectChunks.push(docs.slice(i, i+chunkSize));
                }
                  res.render('find_tutor', {  tutors: subjectChunks });
                
              }).sort({price:+1});

             }

             else if(req.query.z){

               

                console.log('display zipcode');
              tutor.find( {zipcode:req.query.z}, function(err, docs){
                var subjectChunks = [];
                var chunkSize = 3;
                for(var i=0; i < docs.length; i+= chunkSize){
                    subjectChunks.push(docs.slice(i, i+chunkSize));
                }
                  res.render('find_tutor', {  tutors: subjectChunks });
                
              }).sort({price:+1});


             }

             else {

              console.log('query based on ip and zipcode');
               tutor.find( {location:city}, function(err, docs){
                    var subjectChunks = [];
                    var chunkSize = 3;
                    for(var i=0; i < docs.length; i+= chunkSize){
                        subjectChunks.push(docs.slice(i, i+chunkSize));
                    }
                      res.render('find_tutor', {  tutors: subjectChunks });
                    
                  }).sort({price:+1});

             }
  });

// Validation Schema, validationg the fields which user is entering

const contactusSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  message: Joi.string().required()
  
});


  router.route('/viewtutor')
  .get((req, res) => {
   
    var tutor_email = req.query.email;
    //console.log(req.query.current_tutor)
   tutor.findOne({ email:tutor_email },function(req,result){

    console.log(result);
     var current_tutor = result.email;

      
      res.render('viewtutor', { name: result.name, email: result.email, location: result.location, rating: result.rating, subjects: result.subjects });



    });
     
  });


router.route('/inner')
  .get((req, res) => {
    res.render('news');
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

      var rand = Math.floor((Math.random() * 100) + 54);
      const link = "http://127.0.0.1:4000/users/verify?id="+result.value.email;

      const html = `Hi there,
      <br/>
      Thank you for contacting us 
      </br></br>     
      We have recieved your message.
      </br>
      <b>${contact_message}</b>
      <br/> </br>

      <a href="${link}">${contact_message}</a> 
      </br></br>   
      We will reach back to you soon.
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      mailer.sendEmail('tutorry.in@gmail.com', result.value.email, 'Message', html);
      res.redirect('/users/contacts');


  });

  
  
module.exports = router;

console.log('leaving users.js');

