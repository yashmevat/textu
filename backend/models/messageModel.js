const mongoose = require("mongoose")
const messageModel = new mongoose.Schema({
   sender:{
     type:mongoose.Schema.Types.ObjectId,
      ref:"User"
   },
   content:{
    type:String,
    trim:true
   },
   file: {
     type: String,
     default: null
   },
   fileName: {
     type: String,
     default: null
   },
   fileType: {
     type: String,
     default: null
   },
   chat:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Chat"
   }
},{
    timestamps:true
})

const Message = mongoose.model("Message",messageModel)
module.exports=Message