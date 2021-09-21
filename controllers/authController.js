const  User = require('../models/user')
const crypto=require('crypto')
const ErrorHandler = require('../utils/errorHandler')

const catchAsyncError= require('../middlerwares/catchAsyncError');
const sendToken = require('../utils/jwtToken');

const sendEmail=require('../utils/sendEmail');
// register a user  api/v1/register

exports.registerUser=catchAsyncError ( async (req,res,next) => {
    const {name,email,password} = req.body;

    const user =await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"tonu/image",
            url:"https://res.cloudinary.com/ddyadd0vj/image/upload/v1631983822/tonu/1616837669706_nzkcni.jpg"

        }
    })
  sendToken(user,200,res)



}) 

exports.loginUser=catchAsyncError (async (req,res,next)=>{
    const {email,password}=req.body

    // cheks if email password enterd by the user

    if(!email|| !password){
        return next(new ErrorHandler('please enter email &password',400))
    }

    // finding user in database

    const user= await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('invalid Email or password',400));
    }

    // cheking  id password is correct or not 
    const isPasswordMacthed= await user.comparePassword(password);
    if(!isPasswordMacthed){
        return next(new ErrorHandler('invalid Email or password',400)); 
    }
    sendToken(user,200,res)
})
// forgot password 

exports.forgotPassword = catchAsyncError (async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not Found this Email',404))

    }

    // Get reset password Token 
    const resetToken =crypto.randomBytes(20).toString('hex')

    
// saving token
    user.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire=Date.now()+30*60*1000;
    
    await user.save({validateBeforeSave:false})
    // Cretse Reset url

    const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message=`Your Password Reset Token IS as follow:\n\n${resetUrl}\n\n if You have not request this email then ignore it`

    try {

        await sendEmail({
            email:user.email,
            subject:"ShopOnVY Password Reset",
            message
        })

        res.status(200).json({success:true,
        message:`Email Sent to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }




})

// reset password
 exports.resetPassword= catchAsyncError (async (req,res,next)=>{


     const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex');
 
        // console.log(resetPasswordToken)
     const user= await User.findOne({ 
         resetPasswordToken,
         resetPasswordExpire:{$gte:Date.now()}
     })

     if(!user){
         return next(new ErrorHandler('Password reset TOken Is Invalid or has expired',400))
     }

     if(req.body.password !==req.body.confirmPassword){
        return next(new ErrorHandler('Passowrd does not match ',400))
    }
// setting new password
     user.password=req.body.password
     user.resetPasswordToken=undefined
     user.resetPasswordExpire=undefined
     await user.save()


     sendToken(user,200,res)

 })

// get current logged user details
exports.getUserProfile = catchAsyncError (async (req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({success:true,user})
})


// update user passowrd or change password
exports.updatePassword= catchAsyncError (async (req,res,next)=>{
 
    if(!req.body){
        return next(new ErrorHandler(' plase enter new password',400))   
    }
    const user= await User.findById(req.user.id).select('+password')

    // check pervious user password

    const isMacthed=await user.comparePassword(req.body.oldPassword,)

    if (!isMacthed){
     return next(new ErrorHandler('old password is incoredt',400))   
    }
    user.password=req.body.password;
    await user.save()
    sendToken(user,200,res)


    
})


// update user profile 
exports.updateProfile=catchAsyncError (async (req,res,next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,

    }
    const user =await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:true,
    })

    res.status(200).json({
        success:true,
    })
})




// logout user =api/v1/logout

exports.logoutUser = catchAsyncError (async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:"logged out"
    })
})


// Admin Routes

// GEt all Users 
exports.allUsers= catchAsyncError (async (req,res,next)=>{
    const users=await User.find()
    res.status(200).json({success:true, users})
})

// Get  User details
exports.getUserDetails= catchAsyncError (async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User does not exit with this id',400))
        
    }
    res.status(200).json({success:true,user})
})



// admin update user profile
exports.updateUser=catchAsyncError (async (req,res,next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,

    }
    const user =await User.findByIdAndUpdate(req.params.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:true,
    })
    await user.save()
    res.status(200).json({
        success:true,
        user
    })
})


// admin can delete user
exports.deleteUser=catchAsyncError (async (req,res,next)=>{
    const  user =await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler('User does not exit with this id',400))
        
    }

    // remove user from cloudinary-todo
    await user.remove()
    res.status(200).json({success:true})

})