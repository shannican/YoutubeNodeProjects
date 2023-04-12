const multer = require("multer")
const crypto = require("crypto")
const path = require("path")

const videoUpload = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/videos')
    },
    filename:function(req,file,cb){
        var fn = `${Date.now()}-${crypto.randomBytes(20).toString("hex")}${path.extname(file.originalname)}`;
       cb(null,fn)
    }
})

const profile = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        var filename = Date.now()+Math.random()*1000000+file.originalname;
        cb(null, filename)
    }
})

module.exports= {videoUpload,profile}