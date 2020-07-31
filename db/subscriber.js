var mongoose = require('mongoose');

var schema = mongoose.Schema;
 
var subscriber = new schema({
    
    _id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },

}, {collection: 'subscribers'});


module.exports = mongoose.model('subscribers',subscriber,'subscribers');
    