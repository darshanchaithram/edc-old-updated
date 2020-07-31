var express = require('express');
var router = express.Router();
var User = require('../../../db/User');

//dashboard settings home page router
router.get('/', function(req, res, next) {
    var abcd = req.session;
    res.render("pages/dashboard/settings", { title: 'Dashboard', authdata: abcd, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
    req.flash('dothis', '');
    req.flash('type', '');
    req.flash('icon', '');
    req.flash('message', '');
});

//change password get and post routes
router.get('/changepassword', function(req, res) {
    var abcd = req.session;
    res.render("pages/dashboard/changepwd", { title: 'Dashboard', authdata: abcd, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
    req.flash('dothis', '');
    req.flash('type', '');
    req.flash('icon', '');
    req.flash('message', '');
})
router.post('/changepassword', function(req, res) {
    var id = req.body.email;
    var pwd = req.body.password;
    var password = User().hashPassword(pwd);

    User.findByIdAndUpdate({ _id: id }, { password: password }, function(err, data) {
        if (err) throw err;
        else {
            req.flash('dothis', 'notify');
            req.flash('type', 'success');
            req.flash('icon', 'fa fa-check-double mr-1');
            req.flash('message', ' Password Changed successfully');
            res.redirect('/dashboard/settings');
        }
    })
})
router.post('/newuser', function(req, res) {
        var id = req.body.email;
        var pwd = req.body.password;
        var password = User().hashPassword(pwd);

        User.findByIdAndUpdate({ _id: id }, { password: password, newuser: false }, function(err, data) {
            if (err) throw err;
            else {
                req.flash('dothis', 'notify');
                req.flash('type', 'success');
                req.flash('icon', 'fa fa-check-double mr-1');
                req.flash('message', ' Password Changed successfully');
                res.redirect('/logout');
            }
        })
    })
    //view the users except the current user page route
router.get('/users', function(req, res, next) {
    // var id=req.params.code;
    var database = [];
    var abcd = req.session;
    var usernm = abcd.passport.user.username;
    User.find({ _id: { $nin: [usernm] } }, function(err, foundData) {

        if (err) {
            console.log(err);
        } else {
            //this is done for compatibility with new express hbs. If this is not done it wont work
            for (var i = 0; i < foundData.length; i++) {
                database[i] = foundData[i].toObject();
            }
            var abcd = req.session;
            if (abcd.passport.user.acctype == "admin") {
                res.render("pages/dashboard/viewusers", { title: 'Dashboard', authdata: abcd, items: database, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
                req.flash('dothis', '');
                req.flash('type', '');
                req.flash('icon', '');
                req.flash('message', '');
            } else {
                res.render('pages/error/error', { code: '403', message: 'Access denied', layout: false });
            }
            //  console.log(foundData);
        }

        // console.log(database);
    }); //to sort the activities data by date in descending order 
});

//remove a user post data manage route
router.post('/users', function(req, res, next) {
    if (req.session.passport.user.acctype == "admin") {
        id = req.body.userid;
        User.findOneAndDelete({ "_id": id }, function(err, data) {
            // res.send("err: "+err+"/ndata: "+data);
            if (err) {
                req.flash('dothis', 'notify');
                req.flash('type', 'danger');
                req.flash('icon', 'fa fa-times mr-1');
                req.flash('message', 'Unknown error occured!! Try again');
                res.redirect('/dashboard/settings/users');
            } else {
                req.flash('dothis', 'notify');
                req.flash('type', 'success');
                req.flash('icon', 'fa fa-trash-alt');
                req.flash('message', ' User: ' + data.uname + ' deleted successfully');
                res.redirect('/dashboard/settings/users');
            }
        });
    } else {
        req.flash('dothis', 'notify');
        req.flash('type', 'warning');
        req.flash('icon', 'fa fa-exclamation mr-1');
        req.flash('message', 'You need to be an admin to do that!');
        res.redirect('/dashboard/users');
    }

});

//add new user page route
router.get('/adduser', function(req, res, next) {
    var abcd = req.session;
    if (abcd.passport.user.acctype == "admin") {
        res.render("pages/dashboard/adduser", { title: 'Dashboard', authdata: abcd, notify: [{ dothis: req.flash('dothis'), type: req.flash('type'), icon: req.flash('icon'), message: req.flash('message') }] });
        req.flash('dothis', '');
        req.flash('type', '');
        req.flash('icon', '');
        req.flash('message', '');
    } else {
        res.render('pages/error/error', { code: '403', message: 'Access denied', layout: false });
    }
});



module.exports = router;