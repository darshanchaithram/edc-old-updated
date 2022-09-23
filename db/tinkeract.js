var mongoose = require('mongoose');

var schema = mongoose.Schema;
 
var tinkerschema = new schema({
    
    _id:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    details :{
        type:String,
        required:true,
    }
}, {collection: 'tinkerhubact'});


module.exports = mongoose.model('tinkerhubact',tinkerschema,'tinkerhubact');
    