const mongoose = require('mongoose');
const {app} = require('./app')
const http = require('http')
const {Server} = require('socket.io')

mongoose.connect('mongodb://localhost:27017/project1userregidata').then(()=>{
    console.log('connection estabilised')
}).then((error)=>{
     console.log(error)
})

 const httpserver  = http.createServer(app);

  const io = new Server(httpserver,{
       cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
       }
  })



 httpserver.listen(8000,()=>{
      console.log('server is up')
})

  io.on('connection',socket=>{
     socket.on('message',(getComment)=>{
        io.emit('message',getComment) 
     })
 })