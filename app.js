const express =require('express');
var cors = require('cors')
const fileupload=require('express-fileupload'); 
const app=express();
const errorMiddleware = require('./middlerwares/error');

const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const cloudinary=require('cloudinary');

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(fileupload())
// import all the routes
app.use(bodyparser.urlencoded({ extended:true}))






const product =require('./routes/product')
const auth =require('./routes/auth');
const order =require('./routes/order');

app.use('/api/v1',product)
app.use('/api/v1',auth)
app.use('/api/v1',order)
// middler ware to handle  error
app.use(errorMiddleware)
module.exports=app;