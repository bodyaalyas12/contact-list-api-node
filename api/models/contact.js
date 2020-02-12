const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    info:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    }
}) 

module.exports = mongoose.model('Contact',contactSchema)