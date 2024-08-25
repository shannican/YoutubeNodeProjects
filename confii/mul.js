const multer = require("multer")
const path = require("path")
const profileUploads = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      var filename = Date.now() + Math.random() * 1000000 + file.originalname;
      cb(null, filename)
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


module.exports= {profileUploads,profile}