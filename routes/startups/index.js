var express = require('express');
var router = express.Router();
var Startup = require('../../db/Startup');

router.get('/:code',function(req,res,next){
  var id=req.params.code;
  console.log("startpuid: "+id);
  var select = req.query.select;
  var database=[];
  
  Startup.find({"_id":id}, function(err, foundData) {
    console.log("error is " + err);
    if (err) {
    console.log("reached");
    console.log(err);    
     res.render('pages/error/error',{code:'404',message:'Data not found'+ err,layout:false});

    }
    else {
    console.log(foundData.length);    
      if(foundData.length == 0){
        res.render('pages/error/error',{code:'404',message:'Data not found',layout:false});
      }
      else{
        //this is done for compatibility with new express hbs. If this is not done it wont work
        for(var i=0;i<foundData.length;i++){
          database[i]=foundData[i].toObject();
        }
        res.render('pages/home/startupdetail',{title:"Startup Detail",items:database,btn:"hidden"});
      }
      // console.log(foundData);
    }
     // console.log(database);
   });
});

module.exports = router;
