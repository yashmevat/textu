const mongoose = require("mongoose")

const connectDB= async()=>{
  try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
      if(conn){
        console.log("connection successful")
      }
  } catch (error) {
    console.log("error in connection to db" ,error)
  }
}

module.exports=connectDB