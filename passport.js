var localStrategy = require('passport-local').Strategy;
var User = require('./db/User');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new localStrategy(function(username, password, done) {
        User.findOne({ _id: username }, function(err, doc) {
            var resultarray = [];
            resultarray.push(doc);
            if (err) {
                return done(err);
            } else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password);
                    var permission = false;
                    if (doc.acctype == "admin") {
                        permission = true;
                    }
                    if (valid) {
                        done(null, {
                            username: doc._id,
                            uname: doc.uname,
                            acctype: doc.acctype,
                            newuser: doc.newuser,
                            permission: permission,
                        });
                    } else {
                        return done(null, false, { message: 'Invalid Credentials' });
                    }
                } else {
                    return done(null, false, { message: 'User doesnt exist' });
                }
            }
        })
    }))
}