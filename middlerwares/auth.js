const catchAsyncError = require("./catchAsyncError");
 
const User = require("../models/user")
const ErrorHandler=require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
// check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    const {token}= req.cookies
    // console.log(token)
    if (!token){
        return next(new ErrorHandler('logging frist to acces this resource',401))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()

})


// handling user  roles
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           
           return next ( new ErrorHandler(`Role ${req.user.role} is not allowed to accees the resources`,403))
        }
        next()
    }
}