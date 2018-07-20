

const express = require('express');
const router = express.Router();

const Requirement = require('../models/requirements');


/*router.get('/', (req, res) => {


    res.render('index');
});*/

router.get( (req, res, next) => {
    Requirement.find( function(err, docs){
      var requirementChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          requirementChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('index', {  requirement: requirementChunks });
      
     
      // username: req.user.username,
     // email: req.user.email
    });
  });

module.exports = router;