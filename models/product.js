const mongoose =require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        maxlength:[100,'product name cannot exceed  100']
    },
    price :{
        type:Number,
        required:[true,"Please enter product price"],
        maxlength:[5,"Please enter product price cannot exceed 5"]
    },
    description :{
        type:String,
        required:[true,"Please enter product description"]
    },
    ratings:{
        type:Number,
        default:0 

    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
              type:String,
              required:true
                
            }
        }
    ],
    category:{
        type:String,
        required:[true,"plese select catagory for this products"],
        enum:{
            values:[
                "Electronic",
                'Camera',
                'Laptop',
                'Accessories',
                'Headphone',
                'Food',
                'Cloths/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
                ],message:"plase select correcr cotogory for this product"

        }
    },
    seller:{
        type:String,
        required:[true,"Please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product stock"],
        maxlength:[5,"product stock cannot exceed 5 characters"]
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            },   
             user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model('Product',productSchema);