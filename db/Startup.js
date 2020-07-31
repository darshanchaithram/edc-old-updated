var mongoose = require('mongoose');

var schema = mongoose.Schema;
 
var startupSchema = new schema({
    
    _id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    regno:{
        type:String,
    },
    founderscount:{
        type:Number,
    },
    founders:[
        {
            name:String,
            position:String,
        },
    ],
    description:String,
    additional:String,
    recworkscount:Number,
    recentwork:[
        {
            detail:String,
            link:String,
            type:{type:String},
        },
    ],
    weblink:[String],
    contact:[String]

}, {collection: 'startupdata'});


module.exports = mongoose.model('startupdata',startupSchema,'startupdata');
    