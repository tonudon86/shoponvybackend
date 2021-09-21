const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const crypto= require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: [true,"please enter your name"],
        maxLength:[30,'Your name cannot exceed 30 characters']
    },
    email: {
        type: 'string',
        required: [true,"Please enter your email address"],
        unique: true,
        validate:[validator.isEmail,'plese enter your valid email address'],
    },
    password: {
        type: 'string',
        required: [true,"Please enter your password"],
        minLength:[6,'Your password must be at least 6 characters'],
        select:false,
    },
    avatar:{
        public_id: {
            type: 'string',
            required:true,

        },
        url: {
            type: 'string',
            required:true,
 
        }
    },
    role:{
        type: 'string',
        default:"user"
    },
    created_at: {
        type: Date,
        default:Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date,
  
})
// enctyp password

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next()
    }

    this.password=await bcrypt.hash(this.password,10);

})

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}




// return json web token 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}



 
module.exports =mongoose.model('User',userSchema);