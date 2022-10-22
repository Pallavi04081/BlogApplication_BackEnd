const express = require('express')
const app = express();
const Router  = require('./Router')
const cors = require('cors');


app.use(express.json())
//app.use(body_prser.urlencoded({extends:false}))
app.use(cors());

app.use('/',Router)
 


module.exports = {app};



