var express = require('express');
var router = express.Router();
var User = require('../../db/User');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const creds = require("../dashboard/creds.json");
const path = require('path');
const Promise = require('bluebird');

//Mailer code start
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: creds.userid,
        pass: creds.password
    }
});

function sendEmail(obj) {
    return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(path.join('views', '/pages/mailtemplates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            })
        })
    }))
}
//MailercodeEnd


module.exports = function(passport) {
    router.post('/signup', function(req, res) {
        var d = new Date();
        var passgen = "iEDC" + d.getDate() + d.getMilliseconds() + parseInt(Math.random() * 100)
        var body = req.body,
            username = body.email,
            uname = body.uname,
            password = passgen,
            acctype = body.acctype;
        User.findOne({ _id: username }, function(err, doc) {
            if (err) { res.status(500), send('error occured') } else {
                if (doc) {
                    res.status(500).send('Exists');
                } else {
                    var record = new User();
                    record._id = username;
                    record.uname = uname;
                    record.password = record.hashPassword(password);
                    record.acctype = acctype;
                    record.save(function(err, user) {
                        if (err) {
                            res.status(500).send('db error ' + err)
                        } else {
                            var database = [{
                                "name": uname,
                                "code": password,
                                "email": username
                            }];
                            //Mailer Call Start
                            loadTemplate('createuser', database).then((results) => { //the string is the name of folder in which respective template is located
                                return Promise.all(results.map((result) => {
                                    sendEmail({
                                        to: result.context.email,
                                        from: 'Me ;)',
                                        subject: result.email.subject,
                                        html: result.email.html,
                                    });
                                }));
                            }).then(() => {
                                console.log("Mail sent");
                            });
                            //MailercallEnd
                            req.flash('dothis', 'notify');
                            req.flash('type', 'success');
                            req.flash('icon', 'fa fa-user-check');
                            req.flash('message', 'User: ' + user.uname + ' created successfully');
                            res.redirect("/dashboard/settings/users");
                        }
                    })
                }
            }
        })
    });

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true,
    }), function(req, res) {})
    return router;

};