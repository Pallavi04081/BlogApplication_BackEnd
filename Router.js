const express = require('express');
const UserRegistrationData = require('./userSchema')
const bcrypt = require('bcrypt');
const Router = express.Router();
const Token = require('./tokenSchema')
const jwt = require('jsonwebtoken')
const env = require('dotenv')
const upload = require('./upload')
const grid  = require('gridfs-stream');
const mongoose = require('mongoose');
const UserPost = require('./userPostSchema');
const { off } = require('./userPostSchema');

env.config();

let gfs,gridfsBucket;
const  conn = mongoose.connection;
conn.once('open',()=>{
   gridfsBucket  = new mongoose.mongo.GridFSBucket(conn.db,{
      bucketName:'fs'
   });
   gfs = grid(conn.db,mongoose.mongo);
   gfs.collection('fs')
})



Router.post('/register',async(req,res)=>{
 try{
    const password1 =  bcrypt.hash(req.body.password, 10, function(err, hash) {
          console.log(hash) })
   const Result = await UserRegistrationData.create({
            name : req.body.name,
            userName : req.body.username,
            password : req.body.password
   })
      console.log(Result)
      res.json(Result);
 }
 catch(error){
        res.send(error.message) 
 }

})

Router.post('/login',async(req,res)=>{            
      try{
         console.log(req.body.username)
       const Result = await UserRegistrationData.findOne({userName:req.body.username})
       
         if(!Result)  {
            res.status(400).send({
              msg:"incorrect username or password"
            })
         }  
         if(!Result.password==req.body.passward){
              res.status(400).send({
                     msg:"ncorrect username or password"
              })
           }
     const expiredToken =  jwt.sign({Result},'1d1d43375d5c67bfec306dbb2a696f4d222c83ccd41673274a6f42995d781db7ba7599ea3492aaa322e2dd1e5ecccf6486ec5c940241ebf0d29f4ae6ed0fd77d',{expiresIn:'15m'})
    const permentToken  = jwt.sign({Result},'a6018563356a932082200fe12cbf86d11cbb85394e562fc549e5629b7d018bfe13a0d25e0827b5327deb737f2f4c38a84321249415a5e69e4b9056329c8359f7')
    
      const newToken = await Token.create({
         permentToken : permentToken
      })
               res.status(200).json({experiedToken:expiredToken,permentToken:newToken.permentToken,name:Result.name,userName:Result.userName})
      }
      catch(error){
              console.log(error)
      }
})


Router.post("/image",upload.single('userpic'),(req,res)=>{
   try{  
   if(!req.file){
         res.send('file not found')
      }    
      const imageDta =  `${'http://localhost:8000'}/image/${req.file.filename}`
      console.log(imageDta);
      res.status(200).json({imageDta}) }
      catch(error){
         console.log(error)
      }
})



Router.get('/image/:filename',async(req,res)=>{   
   try{
    const file = await gfs.files.findOne({filename : req.params.filename})
    const readStream = gridfsBucket.openDownloadStream(file._id)
    readStream.pipe(res)
   }
   catch(error){
      return res.status(500).json({msg:error.message})
   }
})

Router.post('/userPost',async(req,res)=>{
      try{      
       const token  = req.headers.authorization;
       console.log(token);
       if(!token){
         res.send("please login")
       }
       const UserData = jwt.verify(token,'a6018563356a932082200fe12cbf86d11cbb85394e562fc549e5629b7d018bfe13a0d25e0827b5327deb737f2f4c38a84321249415a5e69e4b9056329c8359f7')
       //console.log(UserData.Result.userName); 
       const userName = UserData.Result.userName;
       if(userName === req.body.userName){
       const Result = await UserPost.create({
            title:req.body.title,
            description:req.body.Discription,
            category:req.body.category,
            date:req.body.createdDate,
            image:req.body.image,
            username:req.body.userName
         })
       }}
      catch(error){
        res.send(msg=error.message)
      }
})

Router.get('/userPost',async(req,res)=>{
   try{ 
      const category = req.query.category
      let Result;
       if(category){
          Result = await UserPost.find({category:category})}
       else{
         Result  = await UserPost.find({});
       }
      res.status(200).json({
         Result:Result
      })
       }
   catch(error){
     res.send(msg=error.message)
   }
})

Router.get('/getPost/:id',async(req,res)=>{
   try{ 
      //console.log(req.query.id)
      const Result = await UserPost.find({_id:req.params.id})
      console.log(Result)
      res.json({
         Result
      })
       }
   catch(error){
     res.send(msg=error.message)
   }
})

Router.delete('/deletePost/:id',async(req,res)=>{
   try{ 
      const Result = await UserPost.findByIdAndDelete({_id:req.params.id})
      res.json({
          Result
      })
       }
   catch(error){
     res.send(msg=error.message)
   }
})





module.exports = Router;

