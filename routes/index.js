

const express = require('express');
const router = express.Router();

const Requirement = require('../models/requirements');
const User = require('../models/user');



router.get('/', (req, res) => {


    res.render('index');
});

/*router.get( '/', (req, res, next) => {
    Requirement.find( function(err, docs){
      var requirementChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          requirementChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('index', {  requirement: requirementChunks });
     
    });*/

    /* User.find( function(err, docs){
      var tutorChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          tutorChunks.push(docs.slice(i, i+chunkSize));
      }
       // res.render('index', {  tutor: tutorChunks });
       res.render('index', {  tutor: tutorChunks  });
     });*/

		//res.render('index', {  tutor: tutorChunks , requirement: requirementChunks });     

  //});

module.exports = router;