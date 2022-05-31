const Product= require('../models/product');
const cloudinary=require('cloudinary');
const ErrorHandler = require('../utils/errorHandler')

const catchAsyncError=require('../middlerwares/catchAsyncError');

const APIFeatuers=require('../utils/APIFeatuers'); 
const { createIndexes } = require('../models/product');


// add product
exports.newProducts = catchAsyncError( async (req,res,next)=>{

    let {name,price,description,category,image}=req.body
   
    let images=[]
    const result=await cloudinary.v2.uploader.upload(image,{
        folder:'products',
        width:150,
        crop:'scale'
    })
    images.push({
        public_id:result.public_id,
        url:result.url
    })
    const product=await Product.create({
        name,price,description,category,images
    });
    res.status(201).json({
        success: true,
        product
    })
})
// get all product
exports.getProducts=catchAsyncError(  async(req,res,next)=>{
    // return next(new ErrorHandler("noob",400))
    const resPerPage=8
    const productsCount=await Product.countDocuments()
    const apiFeatuers=new APIFeatuers(Product.find(),req.query)
                .search().filter().pagination(resPerPage);
    const products=await apiFeatuers.query
    
    res.status(200).json({
        success:true,
        count: products.length,
        products,
        productsCount,
        resPerPage
    })
})

// get single product

exports.getSingleProduct = catchAsyncError( async (req, res, next) =>{
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        const product=await Product.findById(req.params.id)
        // console.log(product)
        if(!product){
           return next(new ErrorHandler("product not found",404))
        }
     
        return  res.status(200).json({
        success:true,
        product
       
    })
      }
      return  next(new ErrorHandler("invalid product  id",404)) 
      
    
    
})


 


// update product admin 
exports.updateProduct = catchAsyncError( async (req,res,next)=>{
    let product=await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }
 
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false

    })

    // console.log("hello")
    res.status(200).json({success:true ,product})

})






// detele product admin :delete


exports.deleteProduct=catchAsyncError( async (req, res, next) => {
    const product =await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler("product not found",404))
    }
    await product.remove();
    res.status(200).json({success:true,
    message:"Product deleted successfully"});
})



// Create new Review  api/v1/review
exports.createProductReview= catchAsyncError( async (req,res,next)=>{
    const{rating,comment,productId} = req.body;


    const review={
        user: req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment


    }

    const product=await Product.findById(productId);
    const isReviewed=product.reviews.find(
        r=>r.user.toString()===req.user._id.toString()
    )
    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString()===req.user._id.toString()){
                review.comment=comment;
                review.rating =rating;
            }
        })

    }else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;

    }
    product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
    await product.save({validateBeforeSave:false});
    res.status(200).json({success:true})



})

// get al the review  api/v1/reviews

exports.getProductsReviews=catchAsyncError( async (req, res, next) => {
    const products = await Product.findById(req.query.id);
    res.status(200).json({success:true,reviews:products.reviews})
})

// delete products the  reviews 
exports.deleteReviews=catchAsyncError( async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString()!==req.query.id);
    


    const numOfReviews=reviews.length
const ratings=product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length


    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindandModify:false
    })
    res.status(200).json({success:true })
})


// admin get all Products 
exports.getAllProducts=catchAsyncError(async (req,res,next)=>{
    let {category}=req.body
    if(category){
     
        let products= await Product.find({category})
        res.status(200).json({ success: true,data:products})
    }
    else{
        let products= await Product.find()
        res.status(200).json({ success: true,data:products})
    }
    
})
