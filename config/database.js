const mongoose=require('mongoose');


const connectDatabase=()=>{
mongoose.connect(process.env.DB_LOCAL_URI,()=>{
    console.log("connected to mongo")
}) 
}
module.exports=connectDatabase
 