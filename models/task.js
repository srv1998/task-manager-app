const mongoose = require('mongoose')

let taskSchema= new mongoose.Schema({
    desc:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
let Task= mongoose.model('Task',taskSchema)

module.exports= Task