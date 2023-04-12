const mongoose = require('mongoose')
const { array } = require('../confii/multer')
var mediaSchema = mongoose.Schema({
    title:String,
    description:String,
    video:String,
    comment:{
      type:Array,
      default:[],
    },
    date:{
      type:Date,
      default:Date.now,
    },
    likes:{
      type:Number,
      default:0,
    },
})

module.exports = mongoose.model('media', mediaSchema)