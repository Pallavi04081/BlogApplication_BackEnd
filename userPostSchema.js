const mongoose = require('mongoose')

const post = new mongoose.Schema({
     title:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     
     category:{
        type:String,
     },
     date:{
        type:Number
     },
     image:{
        type:String
     },
     username:{
        type:String,
        required:true
     }
})

const UserPost = mongoose.model("UserPost",post)

module.exports = UserPost;