var express = require('express');
var router = express.Router();
var Idcard = require('../../db/idcard');

//mongodb activities routes
router.get('/:code',function(req,res,next){
  var id=req.params.code;
    var database=[];
  Idcard.find({"_id":id}, function(err, foundData) {
    console.log("error is " + err);
    if (err) {
    console.log("reached");
    console.log(err);    
     res.render('pages/error/error',{code:'404',message:'Data not found',layout:false});

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
        res.render('pages/home/idcard',{items:database});
      }
      // console.log(foundData);
    }
     // console.log(database);
   });
});

module.exports = router;

