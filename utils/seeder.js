const Product = require("../models/product")

const dotenv =require('dotenv')

const connectDatabase = require('../config/database')

const products=require('../data/product.json')
 


 

// setting dot env variable
dotenv.config({path:'./config/config.env'})


connectDatabase()

const seedProduct =async ()=>{
// console.log("hello")
    try {
            await Product.deleteMany();
            console.log("products are deleted")
            await Product.insertMany(products)
            console.log("products are added")
            process.exit()
            
    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}


seedProduct();