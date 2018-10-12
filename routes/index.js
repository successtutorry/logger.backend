
const express = require('express');
const router = express.Router();
const tutor = require('../models/tutors');
const request = require('request');


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

    console.log(body);
    city = body.city;
     console.log(body.city);
  }

});



router.get('/', (req, res) => {

	tutor.find( {location:city }, function(err, docs){
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