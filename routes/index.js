var express = require('express');
var router = express.Router();
var User = require('../db/User');
var Startup = require('../db/Startup');
var activities = require('../db/activities');
var Regdb = require('../db/register');
const createHttpError = require('http-errors');


var loggedin = function (req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/login');
  }
}

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Homepage', condition:false });
// });
router.get('/', function(req, res, next) {
  var resultArray = [];
      activities.find({},function(err,foundData){
        //this is done for compatibility with new express hbs. If this is not done it wont work
        for(var i=0;i<foundData.length;i++){
          resultArray[i]=foundData[i].toObject();
        }
        res.render('pages/home/home', { title: 'iEDC NSSCE',items:resultArray });
      }).sort( { _id: -1 } ).limit( 5 );
  });
router.get('/startups', function(req, res, next) {
  res.render('pages/home/startups', { title: 'Startup Page', condition:false });
});

router.get('/team', function(req, res, next) {
  res.render('pages/home/team', { title: 'Our Team', condition:false });
});
router.use('/idcard', require('./idcard'));
router.use('/activities', require('./activities'));
router.use('/register', require('./register'));
router.use('/workshopregister', function(req,res){
  res.render('pages/workshopregister/workshop')
}
);
router.use('/dashboard', loggedin , require('./dashboard'));
router.use('/startup', require('./startups'));
router.get('/12345678/pagedit/signup', function(req, res, next) {
  res.render('pages/dashboard/signup', { title: 'Signup page'});
});
router.get('/login', function(req, res, next) {
  let abcd=req.session;
    let eflash=req.flash('logout');
    if(eflash=='exists'){
      req.flash('logout','');
      req.session.destroy();
      var data="Successfully logged out";
      var btn = "success";
    }
    else if(abcd.flash.error!=undefined){
      var data=abcd.flash.error;
      data=data[data.length-1];
      var btn="danger";
    }
    res.render('pages/dashboard/login', { title: 'Login page',message:data,button:btn});
});
// router.get('/abcd', function(req, res, next) {
//   res.render('pages/dashboard/admin/home', { title: 'Dashboard'});
// });
router.get('/logout',function(req,res){
  req.logout();
  req.flash('logout','exists');
  res.redirect('/login');
})



module.exports = router;
