var express = require('express');
var router = express.Router();
var Regdb = require('../../db/register');
var activities = require('../../db/activities'); //The collection schema is imported into the js
var User = require('../../db/User');
var fs = require('fs'); //file system module to remove files from the server on users request
let multer = require('multer'); //file upload module
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const creds = require('./creds.json');
const path = require('path');
const Promise = require('bluebird');
const { route } = require('../idcard');
const { resolve } = require('path');
const { rejects } = require('assert');

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

//function to check whether user is loggedin while accesing the dashboard
var loggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

//dashboard homepage router
router.get('/', loggedin, function(req, res, next) {
    var database = [];
    Regdb.find({}, function(err, foundData) {
        if (err) {
            console.log(err);
        } else {
            //this is done for compatibility with new express hbs. If this is not done it wont work
            for (var i = 0; i < foundData.length; i++) {
                database[i] = foundData[i].toObject();
            }
            //  console.log(foundData);
            var abcd = req.session;
            if (abcd.passport.user.newuser) {
                res.render("pages/dashboard/newuser", { title: 'Newuser Change Password', authdata: abcd, items: database, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
                req.flash('dothis', '');
                req.flash('type', '');
                req.flash('icon', '');
                req.flash('message', '');
            } else {
                res.render("pages/dashboard/home", { title: 'Dashboard', authdata: abcd, items: database, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
                req.flash('dothis', '');
                req.flash('type', '');
                req.flash('icon', '');
                req.flash('message', '');
                // console.log(database);
            }
        }
    }).sort({ applydate: -1 });
});

//dashboard home actions for admin and panel members
router.post('/', loggedin, function(req, res, next) {
    var abcd = req.session;
    var regid = req.body.regid;
    if (abcd.passport.user.acctype == 'panel') {
        var d = new Date();
        var date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        if (req.body.presentdate) {
            Regdb.findByIdAndUpdate({ _id: regid }, { presentdateyes: true, presentdate: req.body.presentdate }, function(err, data) {
                if (err) {
                    throw err;
                } else {
                    req.flash('dothis', 'notify');
                    req.flash('type', 'success');
                    req.flash('icon', 'fa fa-check-double mr-1');

                }
            }).then(() => {
                Regdb.find({ _id: regid }, function(err, foundData) {
                    if (err) {
                        console.log(err);
                    } else {
                        var database = [];
                        foundData.forEach(a => {
                            database[0] = a.toObject();
                        });
                        req.flash('message', 'Appointment date sent to receipient ' + database[0].Email);
                        res.redirect('/dashboard');
                        //Mailer Call Start
                        loadTemplate('assigndate', database).then((results) => { //the string is the name of folder in which respective template is located
                            return Promise.all(results.map((result) => {
                                sendEmail({
                                    to: result.context.Email,
                                    from: 'Me ;)',
                                    subject: result.email.subject,
                                    html: result.email.html,
                                });
                            }));
                        }).then(() => {
                            console.log("Mail sent");
                        });
                        //MailercallEnd
                    }
                });
            }); //end then
        } else {
            Regdb.findByIdAndUpdate({ _id: regid }, { reviewyes: true, reviewdate: date }, function(err, data) {
                if (err) {
                    throw err;
                } else {
                    req.flash('dothis', 'notify');
                    req.flash('type', 'success');
                    req.flash('icon', 'fa fa-check-double mr-1');
                }
            }).then(() => {
                Regdb.find({ _id: regid }, function(err, foundData) {
                    if (err) {
                        console.log(err);
                    } else {
                        var database = [];
                        foundData.forEach(a => {
                            database[0] = a.toObject();
                        });
                        req.flash('message', 'Receipient ' + database[0].Email + ' has been notified');
                        res.redirect('/dashboard');
                        //Mailer Call Start
                        loadTemplate('panelapprove', database).then((results) => { //the string is the name of folder in which respective template is located
                            return Promise.all(results.map((result) => {
                                sendEmail({
                                    to: result.context.Email,
                                    from: 'Me ;)',
                                    subject: result.email.subject,
                                    html: result.email.html,
                                });
                            }));
                        }).then(() => {
                            console.log("Mail sent");
                        });
                        //MailercallEnd
                    }
                });
            }); //end then
        }
    } else if (abcd.passport.user.acctype == 'admin') {
        var d = new Date();
        var date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        Regdb.findByIdAndUpdate({ _id: regid }, { registeredyes: true, registereddate: date }, function(err, data) {
            if (err) {
                throw err;
            } else {
                req.flash('dothis', 'notify');
                req.flash('type', 'success');
                req.flash('icon', 'fa fa-check-double mr-1');
            }
        }).then(() => {
            Regdb.find({ _id: regid }, function(err, foundData) {
                if (err) {
                    console.log(err);
                } else {
                    var database = [];
                    foundData.forEach(a => {
                        database[0] = a.toObject();
                    });
                    req.flash('message', 'Receipient ' + database[0].Email + ' has been notified');
                    res.redirect('/dashboard');
                    //Mailer Call Start
                    loadTemplate('registered', database).then((results) => { //the string is the name of folder in which respective template is located
                        return Promise.all(results.map((result) => {
                            sendEmail({
                                to: result.context.Email,
                                from: 'Me ;)',
                                subject: result.email.subject,
                                html: result.email.html,
                            });
                        }));
                    }).then(() => {
                        console.log("Mail sent");
                    });
                    //MailercallEnd
                }
            });
        }); //end then
    }
});

//moredetails of applicant page router
router.get('/v/:code', loggedin, function(req, res, next) {
    var id = req.params.code;
    var database = [];
    Regdb.find({ _id: id }, function(err, foundData) {
        if (err) {
            console.log(err);
        } else {
            if (foundData.length == 0) {
                //  res.render('pages/error/error',{code:'404',message:'data not available',layout:false});
                res.sendStatus(404);
            } else {
                //this is done for compatibility with new express hbs. If this is not done it wont work
                for (var i = 0; i < foundData.length; i++) {
                    database[i] = foundData[i].toObject();
                }
                //  console.log(foundData);
                var abcd = req.session;
                //  console.log(database);
                res.render("pages/dashboard/moredetail", { title: 'Dashboard', authdata: abcd, items: database });
            }
        }
    });
});

//view activities page router
router.get('/activities', function(req, res, next) {
    // var id=req.params.code;
    var database = [];
    activities.find({}, function(err, foundData) {
        if (err) {
            console.log(err);
        } else {
            if (foundData.length == 0) {
                var abcd = req.session;
                // res.render('pages/error/error',{code:'404',message:'data not available',layout:false});
                res.render("pages/dashboard/viewactivities", { title: 'Dashboard', authdata: abcd, items: [{ title: "None" }], notify: [{ dothis: 'notify', type: 'warning', icon: 'fa fa-exclamation mr-1', message: 'No data found' }] });
                req.flash('type', '');
                req.flash('icon', '');
                req.flash('message', '');
            } else {
                //this is done for compatibility with new express hbs. If this is not done it wont work
                for (var i = 0; i < foundData.length; i++) {
                    database[i] = foundData[i].toObject();
                }
                var abcd = req.session;
                // res.render('pages/error/error',{code:'404',message:'data not available',layout:false});
                res.render("pages/dashboard/viewactivities", { title: 'Dashboard', authdata: abcd, items: database, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
                req.flash('dothis', '');
                req.flash('type', '');
                req.flash('icon', '');
                req.flash('message', '');
            }
            //  console.log(foundData);
        }

        // console.log(database);
    }); //to sort the activities data by date in descending order 
});

//View a single activity in detail
router.get('/activities/:code', loggedin, function(req, res) {
        var id = req.params.code;
        activities.findById({ _id: id }, function(err, data) {
            if (err) {
                res.send(404);
            } else {
                var database = [];
                database[0] = data.toObject();
                var abcd = req.session;
                res.render("pages/dashboard/viewoneact", { title: 'Dashboard', authdata: abcd, items: database });

            }
        })
    })
    //delete activity (only for admins) router
router.post('/activities', function(req, res, next) {
    if (req.session.passport.user.acctype == "admin") {
        id = req.body.actid;
        activities.findOneAndDelete({ "_id": id }, function(err, data) {
            // res.send("err: "+err+"/ndata: "+data);
            if (err) {
                req.flash('dothis', 'notify');
                req.flash('type', 'danger');
                req.flash('icon', 'fa fa-times mr-1');
                req.flash('message', 'Unknown error occured!! Try again');
                res.redirect('/dashboard/activities');
            } else {
                // delete images if any associated with the activity 
                if (data.imageyes) {
                    for (var i = 0; i < data.images; i++) {
                        fs.unlink('./public/assets/images/activities/' + data.year + '/' + data.image[i] + '.jpg', function(err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });
                    }
                }
                req.flash('dothis', 'notify');
                req.flash('type', 'success');
                req.flash('icon', 'fa fa-trash-alt');
                req.flash('message', 'Data: ' + data.title + ' deleted successfully');
                res.redirect('/dashboard/activities');
            }
        }).sort({ _id: -1 });
    } else {
        req.flash('dothis', 'notify');
        req.flash('type', 'warning');
        req.flash('icon', 'fa fa-exclamation mr-1');
        req.flash('message', 'You need to be an admin to do that!');
        res.redirect('/dashboard/activities');
    }

});


//add new activity page router
router.get('/addactivity', function(req, res, next) {
    var abcd = req.session;
    res.render("pages/dashboard/addact", { title: 'Dashboard', authdata: abcd, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
    req.flash('dothis', '');
    req.flash('type', '');
    req.flash('icon', '');
    req.flash('message', '');
});

//some global variables for assigning image names
var ik;
var acd;
//add new activity post router images and data processing
router.post('/addactivity', (req, res) => {
    ik = 0;
    acd = new Date();
    acd = acd.getHours() + "" + acd.getMinutes() + "" + acd.getSeconds();
    //end assigning image names
    // console.log(req.body)
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
            var record = new activities();
            var body = req.body;
            record.title = body.title;
            record.date = body.acdate;
            record.detail = body.detail;
            record.type = body.type;
            var d = new Date(body.acdate);
            let acyear = d.getFullYear();
            record.year = acyear;
            var id = body.acdate;
            id = id.replace(/-/g, ""); //replace the - symbol with no space and create id for the document
            id = id + "" + acd;
            record._id = id;
            // record._id=id; 
            // console.log(body.fileno);
            record.images = body.fileno;
            if (record.images > 0) {
                record.imageyes = true;
                for (var i = 0; i < record.images; i++) {
                    record.image[i] = id + "-" + i;
                }
            } else {
                record.imageyes = false;
            }
            // console.log("File name : "+img);

            record.save(function(err, data) {
                    if (err) {
                        res.status(500).send('db error ' + err)
                    } else {
                        var abcd = req.session;
                        req.flash('dothis', 'notify');
                        req.flash('type', 'success');
                        req.flash('icon', 'fa fa-check mr-1');
                        req.flash('message', ' Data Entered Successfully');
                        res.redirect('/dashboard/addactivity');
                    }
                })
                // console.log(req.files);
        }
    })
});
//setting the destination for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let reqdate = new Date(req.body.acdate);
        let acyear = reqdate.getFullYear();
        cb(null, "./public/assets/images/activities/" + acyear + "/");
    },
    filename: function(req, file, cb) {
        let reqdat = req.body.acdate;
        reqdat = reqdat.replace(/-/g, ""); //replace the - symbol with no space and create id for the document
        reqdat = reqdat + "" + acd;
        //console.log(file);
        cb(null, reqdat + "-" + ik + ".jpg");
        ++ik;
    }
});
//Init upload
let upload = multer({
    storage: storage
}).array('fupload', 4);



//route to settings route pages folder
router.use('/settings', loggedin, require('./settings'));



module.exports = router;