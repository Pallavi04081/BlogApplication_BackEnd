const mongoose = require('mongoose')

const token = new mongoose.Schema({   
    permentToken : String
})

const Token = mongoose.model('Token',token)

module.exports = Token;

