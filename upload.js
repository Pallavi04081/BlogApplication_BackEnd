const multer = require('multer')

const {GridFsStorage} = require('multer-gridfs-storage')

const storage = new GridFsStorage({
 url : 'mongodb://localhost:27017/project1userregidata',
 file : (req,file) =>{

   const match = ['image/png','image/jpg']
    if(match.indexOf(file.memeType)==-1){
        return `${Date.now()}-blog-${file.originalname}`;
    }
    return{
          bucketName : "photo",
          fileName : `${Date.now()}-blog-${file.originalname}`
    }
 }

})

const upload = multer({storage})

module.exports = upload;
