
const express = require('express');
const router = express.Router();
const tutor = require('../models/tutors');


router.get('/', (req, res) => {

	tutor.find( { }, function(err, docs){
      var tutorChunks = [];
      var chunkSize = 3;
      for(var i=0; i < docs.length; i+= chunkSize){
          tutorChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('index', {  tutors: tutorChunks });
      
    });
	//res.render('index');
});


module.exports = router;