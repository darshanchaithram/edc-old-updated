var mongoose = require('mongoose');

var schema = mongoose.Schema;
 
var idcardSchema = new schema({
    
    _id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    linkedin:{
        type:String,
        required:true,
        default:"#",
    },
    
    

}, {collection: 'idcard'});


module.exports = mongoose.model('idcard',idcardSchema,'idcard');
    