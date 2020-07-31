var mongoose = require('mongoose');

var schema = mongoose.Schema;
 
var activityschema = new schema({
    
    _id:{
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
    detail:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    imageyes:{
        type:Boolean,
    },
    images:{
        type:String,
        required:true,
    },
    image:[
        
    ]
}, {collection: 'activities'});


module.exports = mongoose.model('activities',activityschema,'activities');
    