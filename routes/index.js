var express = require('express');
var passport = require('passport');
var router = express.Router();
var userModel = require('./users');
const { response } = require('express');
var GoogleStrategy = require('passport-google-oidc');
const { update } = require('./users');
require('dotenv').config();
const confii = require('../confii/multer')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const mediaModel = require('./media')
const medias = require('./media');
var localStrategy = require('passport-local');
const nodemailer = require('../nodemailer')
const profile = require('../confii/mul')

passport.use(new localStrategy(userModel.authenticate()))
passport.use(userModel.createStrategy());

const videoUpload = multer({ storage: confii.videoUpload })

const profileUploads = multer({ storage: confii.profileUploads })

router.post('/create/media', isLoggedIn, videoUpload.single('video'),async function (req, res, next) {
  let user = await req.user
  let data = {
    title: req.body.title,
    description: req.body.description,
    video: req.file.filename,
  }
  let media = await mediaModel.create(data)
  user.medias.push(media._id)
  await user.save();
  console.log(user)
  res.redirect('/home')
})
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

router.get('/home', isLoggedIn, async function (req, res) {
  let user = req.user
  let allmedia = await mediaModel.find()
  res.render('home', { allmedia, user })
})

router.get('/yourVideos', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("medias")
  let allmedia = await mediaModel.find()
  res.render('yourVideos', { user, media: user.medias, data: allmedia })
})
router.get('/watchLater', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("watchLater")
  res.render('watchLater', { user })
})
router.get('/watchLater/:id', async function (req, res) {
  let user = req.user;
  !user.watchLater.includes(req.params.id) ?
    user.watchLater.push(req.params.id) : ''
  await user.save()
  res.redirect('/home');
});
router.get('/removewatchLater/:id', async function (req, res) {
  let user = await req.user
  req.user.watchLater.pull(req.params.id)
  await user.save();
  res.redirect('/watchLater');
});

router.get('/library', isLoggedIn, async function (req, res) {
  let user = await req.user
  let history = await req.user.populate('history')
  let watchLater = await req.user.populate('watchLater')
  let liked_videos = await req.user.populate("liked_videos")
  res.render('library', { user, history, watchLater, liked_videos })
})
router.get('/history', isLoggedIn, async function (req, res) {
  let user = await req.user.populate('history')
  res.render('history', { user })
})
router.get('/removehistory/:id', async function (req, res) {
  let user = await req.user
  req.user.history.pull(req.params.id)
  await user.save();
  res.redirect('/history');
});
router.get('/playlists', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("watchLater")
  res.render('playlists', { user })
})

router.post('/createFolder', isLoggedIn, async function (req, res) {
  let user = await req.user;
  user.tags.push({ tagname: req.body.newfolder })
  await user.save();
  res.redirect('/playlists')
})
router.get('/removeplaylistContent/:id', async function (req, res) {
  let user = await req.user
  user.tags.pull(req.params.id)
  await user.save();
  res.redirect('/playlists');
});

router.get('/playlistFolder/:tagname/:id', isLoggedIn, async function (req, res) {
  let user = await req.user
  let tag = await req.user.tags.filter(t => t._id == req.params.id)[0]
  console.log(tag);
  res.render('playlistFolder', { user, tagid:tag._id, videos:tag.videos })
})

router.get('/playlists/:pid/:mid', isLoggedIn, async function (req, res) {
  let tags = [...req.user.tags]
  let tagIndex = tags.findIndex(t => t._id == req.params.pid)
  let tag = tags.filter(t => t._id == req.params.pid)[0];
  let media = await mediaModel.findById(req.params.mid)
  tag.videos.push(media)
  req.user.tags[tagIndex] = tag;
  await req.user.save()
  res.redirect('/playlists')
})

router.get('/removeplaylist/:tid/:id', async function (req, res) {
  let user = await req.user
  let tags = [...req.user.tags]
  let tag = tags.filter(t => t._id == req.params.tid)[0];
  let tagIndex = tags.findIndex(t => t._id == req.params.tid);
  let videos = [...tag.videos]
  let videoIndex = videos.findIndex(t => t._id == req.params.id);
  let video = videos.filter(t => t._id == req.params.id)[0];
  console.log(videoIndex);
  videos.splice(videoIndex,1)
  tags[tagIndex].videos = videos;
  await req.user.save();
  res.redirect('/playlists/');
});

router.get('/download', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("download")
  res.render('download', { user })
})
router.get('/download/:id', async function (req, res) {
  let user = req.user;
  !user.download.includes(req.params.id) ?
    user.download.push(req.params.id) : ''
  await user.save()
  res.redirect('/download');
});
router.get('/removedownload/:id', async function (req, res) {
  let user = await req.user
  req.user.download.pull(req.params.id)
  await user.save();
  res.redirect('/download');
});
router.get('/likedVideo', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("liked_videos")
  res.render('likedVideo', { user })
})
router.get('/removeliked/:id', async function (req, res) {
  let user = await req.user
  req.user.liked_videos.pull(req.params.id)
  await user.save();
  res.redirect('/likedVideo');
});

router.get('/login', isRedirect, function (req, res) {
  res.render('login')
})
router.get('/register', function (req, res) {
  res.render('register')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/register'
}));

router.post('/register', profileUploads.single("profilePic"), function (req, res) {
  var newUser = new userModel({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    contact: req.body.contact,
    profilePic: req.file.filename,
  })
  userModel.register(newUser, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/home')
      })
    }).catch(function (error) {
      res.send(error);
    })
})

router.post('/checkEmail',async function(req,res){
  const email= await userModel.findOne({ email:req.body.input})
  console.log(email)
  if(email){
    res.send("exists email")
  }else{
    res.send("not exists email")
  }
})

// search user
router.get('/find/:email', function(req,res){
  var regexp = new RegExp("^"+req.params.email)
  userModel.find({email:regexp})
  .then(function(allusers){
    console.log(allusers)
    res.json(allusers)
  })
})


router.get('/search/:description',function(req,res){
  var rexp = new RegExp("^"+req.params.description)
  mediaModel.find({description:rexp})
  .then(function(allmedia){
    console.log(allmedia)
    res.json(allmedia)
  })
})

router.get('/delete/media/:id', isLoggedIn, async function (req, res) {
  const mediaIndex = req.user.medias.findIndex(media => media._id === req.params.id);
  req.user.medias.splice(mediaIndex, 1);
  await mediaModel.findOneAndDelete({ _id: req.params.id }).exec();
  await req.user.save();
  res.redirect('/yourVideos')
})

router.post('/editmedia/media/:idd', isLoggedIn, async function (req, res) {
  let user = req.user
  let media = await mediaModel.findOne({ _id: req.params.idd })
  if (user.medias.includes(media._id)) {
    media.title = req.body.title;
    media.description = req.body.description;
    await media.save()
    res.redirect('/yourVideos')
  } else {
    res.send("error")
  }
})

router.get('/streamingVideo/:id', isLoggedIn, async function (req, res) {
  let user = await req.user.populate("medias")
  let media = await mediaModel.findById(req.params.id);
  const shuffledArray = user.medias.sort(() => 0.1 - Math.random()); // shuffles array
  const result = shuffledArray.slice(0, user.medias.length); // gets first n elements after shuffle
  console.log(result);
  res.render('streamingVideo', { loggedinUser: req.user, user, media, medias: result })
})

router.get('/likes/:idd', async function (req, res) {
  const medialike = await mediaModel.findOne({ _id: req.params.idd })
  const user = await userModel.findOne({ _id: req.user._id })
  let index = user.liked_videos.findIndex((item) => item == req.params.idd)
  if (index == -1) {
    medialike.likes = medialike.likes + 1
    user.liked_videos.push(medialike._id)
  } else {
    if (medialike.likes > 0) {
      medialike.likes = medialike.likes - 1
      user.liked_videos.pull(medialike._id)
    }
  }
  await medialike.save()
  await user.save()
  res.redirect("/streamingVideo/" + medialike._id)
})

router.get('/comment/:idd', isLoggedIn, async function (req, res) {
  const media = await mediaModel.findOne({ _id: req.params.idd })
  var obj = {
    "profilePic": req.user.profilePic,
    "title": req.user.fname,
    "comment": req.query.comment,
    "date": new Date(),
  }
  console.log(obj)

  media.comment.push(obj)
  await media.save()
  res.redirect("/streamingVideo/" + media._id)
})

router.get('/logout', function (req, res, next) {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function isRedirect(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home')
  } else {
    return next();
  }
}

// ------------------------------------------------------

const fs = require("fs");
const media = require('./media');

router.get("/video/:videoname", async function (req, res) {
  console.log("video streaming");
  const videoname = req.params.videoname;
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // get video stats (about 61MB)
  const videoPath = path.join(__dirname, '..', 'public', 'videos', videoname)
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  console.log(start);
  if (start > 20000000) {
    const media = await mediaModel.findOne({ video: req.params.videoname })
    if (!req.user.history.includes(media._id)) req.user.history.push(media._id)
    else {
      await req.user.history.pull(media._id)
      await req.user.history.push(media._id)
    }
    await req.user.save();
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> history mein add ho gye");
  }

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);


});


router.get('/reset/:id/otp/:otp', async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id })
  res.render('reset', { user })
})

router.post('/reset/:id', async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id })
  if (user) {
    user.setPassword(req.body.newpassword, async function () {
      await user.save();
      res.redirect("/login")
    })
  } else {
    res.send("nhi hoga")
  }
})


// google auth

router.get('/login/federated/google', passport.authenticate('google'));
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['email','profile']
}, function verify(issuer, profile, cb) {
    console.log(profile)
    userModel.findOne({emails:profile.emails[0].value},(err,User)=>{
      if(err){
        console.log(err)
        return cb(new Error(err))
      }
      if(User){
        return cb(null,User)
      }
      var newUser = new userModel()
      newUser.name = profile.displayName,
      newUser.email = profile.emails[0].value
      newUser.save((err,User)=>{
        if(err) console.log(err)
        return cb(null, User)
      })
    })
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/register'
}));

router.get('/forgot', function (req, res) {
  res.render('forgot')
})
router.post('/forgot', async function (req, res, next) {
  let user = await userModel.findOne({ email: req.body.email })
  if (user) {
    crypto.randomBytes(17, async function (err, buff) {
      const otpstring = buff.toString("hex")
      user.otp = otpstring;
      await user.save();
      nodemailer(user.email, otpstring, user._id)
        .then(() => {
          console.log("sent mail !");
          res.send("Mail sent!!");
          // res.redirect('/reset/:id/otp/:otp')
          // res.render('reset')
        })
    })
  } else {
    res.send("wrong linked")
  }
})

module.exports = router;
