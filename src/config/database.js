import mongoose from'mongoose'
function connectToDb(){
    if(mongoose.connect(process.env.MONGO_URI)){
        console.log("connected to db")
    }}
    export default connectToDb