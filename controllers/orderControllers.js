const Order=require('../models/order')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlerwares/catchAsyncError');

//create new Order
exports.newOrder=catchAsyncError (async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body
const order =await Order.create({
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAT:Date.now(),
    user:req.user.id
})
res.status(200).json({
    success: true,
    order
})
})




// get Single Order api/v1/order/:id

exports.getSingleOrder = catchAsyncError (async (req, res,next) => {
    const order = await Order.findById(req.params.id)
    
    // .populate("user") 
       if(!order){
        return new ErrorHandler('no order found with this',404)
        }

        res.status(200).json({success: true,order})
})

// get logged user Order api/v1/orders/me

exports.myOrders = catchAsyncError (async (req, res,next) => {
    const order = await Order.find({user:req.user.id}) 
    if(!order){
        return new ErrorHandler('no order found with this',404)
        }
        if(order.length===0){
            res.status(200).json({success: true,message: 'you have not placed any order yet'})
        }

        res.status(200).json({success: true,order})
})


// get all  Orders for admin api/v1/admin/orders/

exports.allOrders = catchAsyncError (async (req, res,next) => {
    const orders = await Order.find() 
    let totalAmount=0
    orders.forEach(order => {
        totalAmount += order.totalPrice
        
    });
    res.status(200).json({success: true,orders,totalAmount})
})


// update /proces   Orders for admin api/v1/admin/order/:id

exports.updateOrders = catchAsyncError (async (req, res,next) => {
    const order = await Order.findById(req.params.id) 
    
    if(order.orderStatus ==='Delivered'){
        return new ErrorHandler('YOu have already Deliverd this order',400)
    }
    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })
    order.orderStatus=req.body.status
    order.deliverAt=Date.now()
    await order.save()
    res.status(200).json({success: true})
})

async function updateStock(id, quantity) {
    const product=await Product.findById(id)
    product.stock=product.stock-quantity
    await product.save({validateBeforeSave :false})
}

// delete order api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError (async (req, res,next) => {
    // console.log(req)
    const order = await Order.findById(req.params.id)
    // .populate("user") \
    if(!order) {
        return next ( new ErrorHandler('no order with this id',404))
    }
  
        await order.remove()
        res.status(200).json({success: true})
    
})