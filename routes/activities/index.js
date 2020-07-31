var express = require('express');
var router = express.Router();
var activities = require('../../db/activities'); //The collection schema is imported into the js

  router.get('/',function(req,res,next){
    // var id=req.params.code;
    var select = req.query.select;
      var database=[];
      activities.find({}, function(err, foundData) {
  
      if (err) {
        console.log(err);    
       res.render('pages/error/error',{code:'404',message:'Connection Error '+ err,layout:false});
      }
      else {
        if(foundData.length == 0){
         res.render('pages/error/error',{code:'404',message:'Data not found',layout:false});
        }
        else{
          //this is done for compatibility with new express hbs. If this is not done it wont work
          for(var i=0;i<foundData.length;i++){
            database[i]=foundData[i].toObject();
          }
          res.render('pages/home/activities',{title:"iEDC Activities",items:database,btn:"hidden"});
        }
       //  console.log(foundData);
       }
  
       // console.log(database);
     }).sort( { date: -1 } );  //to sort the activities data by date in descending order 
  });
    
  
  
  module.exports = router;
  