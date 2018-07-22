// this contains all the api's in our app

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');
var url = require('url');
const bodyParser = require('body-parser');

// requiring from our own modules
const User = require('../models/user');

// Validation Schema, validationg the fields which user is entering

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

// Authorization 

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

     
     
       const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href="http://localhost:5000/users/verify?id=${secretToken}">${secretToken}/</a>
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      await mailer.sendEmail('admin@codeworkrsite.com', result.value.email, 'Please verify your email!', html);

 

      req.flash('success', 'An email verification code has been sent to you email account, Please check your email and click on the link to complete registration');
      res.redirect('/users/login');

    } catch(error) {
      next(error);
    }
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
  .get(isAuthenticated, (req, res) => {
    res.render('dashboard', {
      username: req.user.username,
      email: req.user.email
    });
  });

  // this route is executed when the user tries to access account verification page

router.route('/verify')
 .get(isNotAuthenticated, (req, res) => {
    res.render('verify');
  })
.post(async (req, res, next) => {
   

    try {
     const { secretToken } = req.body;

      // Find account with matching secret token
      const user = await User.findOne({ 'secretToken': secretToken });
      if (!user) {
        req.flash('error', 'No user found with this email id, please check your email id or incorrect link');
        res.redirect('/users/verify');
        return;
      }

      user.active = true;
      user.secretToken = '';
      await user.save();

      req.flash('success', 'Thank you! Now you may login.');
      res.redirect('/users/login');
    } catch(error) {
      next(error);
    }

  });

/*router.route('/profile')
.get(isAuthenticated, (req, res) =>{
 res.render('profile1');

})
.post((req, res) =>{

      console.log(req.body);
      const newProfile = new Profile (req.body); 
      console.log('newProfile', newProfile);
      newProfile.save();
      res.render('profile2');

});*/


router.route('/profile')
.get(isAuthenticated, (req, res) => {
 
res.render('profile', {
      username: req.user.username,
      email: req.user.email
    });
  });

router.route('/postRequirement')
.get(isNotAuthenticated, (req, res) =>{
 res.render('tutorRequirement');
});


router.route('/posttutorRequirement')
.post((req, res) =>{

  res.render('tutorList');

})
.get((req, res) =>{


  
});


router.route('/becometutor')
.get(isNotAuthenticated, (req, res) =>{
 res.render('becometutor');
});

router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out. Hope to see you soon!');
    res.redirect('/');
  });


module.exports = router;







