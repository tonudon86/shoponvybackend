const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) => {
    err.statusCode=err.statusCode||500;
    err.message=err.message||"internal server error";

    if(process.env.NODE_ENV==="PRODUCTION") {
        let error ={...err}
        error.message=err.message

        if (err.name==='CastError'){
          const message = `Resource not Found .Invalid:${err.path}`
          error= new ErrorHandler(message,400)
        }

        if (err.name==='ValidationError'){
        const message = Object.values(err.values).map(value =>value.message)
        error= new ErrorHandler(message,400)
        }
        // handling duplicate eror
        if (err.code===11000){
            const message = `Duplicate  ${Object.keys(err.key.value)} entered`
            error= new ErrorHandler(message,400)
        }

        // handling wrong jwt
        if (err.name==='JsonWenTokenError'){
          const message="json web token invalid"
          error= new ErrorHandler(message,400)
        }
        
        // handling expire jwt token

     if (err.name==='TokenExpiredError'){
          const message="json web token is Expired"
          error= new ErrorHandler(message,400)
        }
      return  res.status(error.statusCode).json({success:false,message:error.message|| 'internal server error'})
    }

    return  res.status(err.statusCode).json({success: false,
        error: err,
        errmessage: err.message,
        stack:err.stack})
}
