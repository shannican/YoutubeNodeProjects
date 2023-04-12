const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/youtubeClone")
  .then(function () {
    console.log("connected to server")
  })

var userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  contact: Number,
  password: String,
  profilePic: {
    type: String,
    default: 'default.png'
  },
  medias: {
    type: Array,
    ref: "media"
  },
  watchLater: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
      default: []
    }
  ],
  tags: [{
    tagname: String, videos: []
  }],
  download: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
      default: []
    }
  ],
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
      default: []
    }
  ],

  liked_videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
      default: []
    }
  ]
})
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
module.exports = mongoose.model("user", userSchema);
