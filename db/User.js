var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var userSchema = new schema({
    _id: {
        type: String,
        required: true,
    },
    uname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    acctype: {
        type: String,
    },
    newuser: {
        type: Boolean,
        default: true,
    },
    date_created: {
        type: Number,
        default: Date.now(),
    },
})

userSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
userSchema.methods.comparePassword = function(password, hash) {
    return bcrypt.compareSync(password, hash)
}

module.exports = mongoose.model('users', userSchema, 'users');