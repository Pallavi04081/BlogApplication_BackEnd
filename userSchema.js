const mongoose = require('mongoose')

const userRegistrationData = new mongoose.Schema({
            
         name:{
            type:String,
            required:true,
         },
         userName:{
            type:String,
             required:true,
             unique : true
         },
         password:{
            type:String,
            required:true,
            unique:true
         }
        
})


const UserRegistrationData = mongoose.model('UserRegistrationData',userRegistrationData)

module.exports = UserRegistrationData;

