var express = require('express');
var router = express.Router();
var Regdb = require('../../db/register');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const creds = require('../dashboard/creds.json');
const path = require('path');
const Promise = require('bluebird');
const subscriber=require('../../db/subscriber');
const { Console } = require('console');
const { isNull } = require('util');

//Mailer code start
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: creds.userid,
    pass: creds.password
  }
});
function sendEmail(obj){
  return transporter.sendMail(obj);
}
function loadTemplate(templateName, contexts){
  let template = new EmailTemplate(path.join('views','/pages/mailtemplates',templateName));
  return Promise.all(contexts.map((context) => {
    return new Promise((resolve, reject) => {
      template.render(context,(err,result) => {
        if(err) reject(err);
        else resolve({
          email:result,
          context,
        });
      })
    })
  }))
}
//MailercodeEnd


router.get('/', function(req, res, next) {
    res.render('pages/home/register', { title: 'Register your startup', condition:false });
  });

router.post('/',function(req,res){
    var randnum=parseInt(Math.random()*100);
    if(randnum<10){
      randnum=99-randnum;//for getting 2 digit number always
    }
    var apdate = new Date();
    var random = 400-(apdate.getSeconds()+apdate.getMinutes()+randnum);//to get 3 digit number
    var monthgen= 22-apdate.getMonth();//for getting 2 digit number always
    var idgen ="iEDC"+apdate.getFullYear()+monthgen+random;
  
    var record = new Regdb();
    var body=req.body;
    record._id = idgen;
    record.firstname= body.firstname;
    record.lastname= body.lastname;
    record.semester= body.semester;
    record.branch= body.branch; 
    record.Email= body.email;
    record.mobile= body.mobile;
    record.cf1name= body.cf1name;
    record.cf1lname= body.cf1lname;
    record.cf1sem= body.cf1sem;
    record.cf1branch= body.cf1branch;
    record.Email1= body.Email1;
    record.mobile1= body.mobile1;
    record.NSSIAN1= body.NSSIAN1;
    record.cf2name= body.cf2name;
    record.cf2lname= body.cf2lname;
    record.cf2sem= body.cf2sem;
    record.cf2branch= body.cf2branch;
    record.Email2= body.Email2;
    record.NSSIAN2= body.NSSIAN2;
    record.cf3name= body.cf3name;
    record.cf3name= body.cf3lname;
    record.cf3sem= body.cf3sem;
    record.cf3branch= body.cf3branch;
    record.Email3= body.Email3;
    record.mobile3= body.mobile3;
    record.NSSIAN3= body.NSSIAN3;
    record.cf4name= body.cf4name;
    record.cf4lname= body.cf4lname;
    record.cf4sem= body.cf4sem;
    record.cf4branch= body.cf4branch;
    record.Email4= body.Email4;
    record.mobile4= body.mobile4;
    record.NSSIAN4= body.NSSIAN4;
    record.cf5name= body.cf5name;
    record.cf5lname= body.cf5lname;
    record.cf5sem= body.cf5sem;
    record.cf5branch= body.cf5branch;
    record.Email5= body.Email5;
    record.mobile5= body.mobile5;
    record.NSSIAN5= body.NSSIAN5;
    record.company= body.company;
    record.website= body.website;
    record.employee= body.employee;
    record.desc1= body.desc;
    record.whopay= body.whopay;
    record.custpain= body.custpain;
    record.Competitors= body.competitors;
    record.UVP= body.UVP;
    record.solution= body.solution;
    record.copyright= body.copyright;
    record.customers= body.customers;
    record.marketing= body.marketing;
    record.makemoney= body.makemoney;
    record.investment= body.investment;
    record.Goals= body.goals;
    record.mentor= body.mentor;
    
    record.save(function(err,user){
      if(err){
          res.status(500).send('db error '+err)
      }
      else{
          var database=[];
          database[0]=user.toObject();
          var hcode="<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1.0,shrink-to-fit=no'><script src='https://unpkg.com/sweetalert/dist/sweetalert.min.js'></script><script>function sweetAlrt(){swal('Congrats!', 'Your application is submitted!', 'success');}</script></head><body onload='sweetAlrt()'><p>Your id is :"+database[0]._id+"</p><p><a href='/register'><button>Go Back</button></a></p></body></html>";
          res.send(hcode);
          //Mailer Call Start
          loadTemplate('applyform',database).then((results) =>{//the string is the name of folder in which respective template is located
            return Promise.all(results.map((result) => {
              sendEmail({
                to:result.context.Email,
                from:'Me ;)',
                subject:result.email.subject,
                html:result.email.html,
              });
            }));
          }).then(() =>{
            console.log("Mail sent");
          });
          //MailercallEnd
      }
    })
  });

  router.post('/subscribe',function(req,res){
    subscriber.countDocuments({},function(err,data){
      if(err) 
      console.log(err);
      else{
        var record=new subscriber();
        var body=req.body;
        if(isNull(data)){
          data=0;
        }
        record._id=++data;
        record.name=body.name;
        console.log("Reached"+body.name);
        record.email=body.email;
        record.save(function(err,user){
          if(err){
            res.status(500).send('db error '+err)
          }
          else{
            var database=[];
            database[0]=user.toObject();
            //Mailer Call Start
            loadTemplate('subscribe',database).then((results) =>{//the string is the name of folder in which respective template is located
              return Promise.all(results.map((result) => {
                sendEmail({
                  to:result.context.email,
                  from:'Me ;)',
                  subject:result.email.subject,
                  html:result.email.html,
                });
              }));
            }).then(() =>{
              console.log("Mail sent");
              return "success";
            });
            //MailercallEnd
          }
        })
      }
    })
  })
  
  module.exports = router;
