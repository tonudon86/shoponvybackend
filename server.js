const app= require('./app');
const dotenv=require('dotenv');
const connectDatabase =require('./config/database')
process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.stack}`);
    // console.log(err.stack);
    console.log("Shutting down the server due to  uncaught Exception ");
     
        process.exit(1)
    
})


 
 // setting up congig file  ;
dotenv.config({path:'./config/config.env'})


// connecting to database
connectDatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`server started on port : ${process.env.PORT} in  ${process.env.NODE_ENV}`)
})


// Handel unhandle promis rejection 
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.message}`)
    console.log("Shutting down the server due to Unhandled Promise Rejection ");
    server.close( ()=>{
        process.exit(1)
    })
})

