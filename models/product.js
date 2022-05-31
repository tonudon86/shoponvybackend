const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxlength: [100, 'product name cannot exceed  100']
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxlength: [5, "Please enter product price cannot exceed 5"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    variations: [{
        variation_name: {
            type:String
        }, variation_price: {
            type:Number
        },
        variation_desc:{
            type:String
        }
    }
    ],
    ratings: {
        type: Number,
        default: 0

    },
    images: [
        {
            public_id: {
                type: String,
                // required: true
            },
            url: {
                type: String,
                // required: true

            }
        }
    ],
    category: {
        type: String,
        required: [true, "plese select catagory for this products"],
        enum: {
            values: [
                "APPETIZER",
                'MEGGIE',
                'GARLIC BREAD',
                'PASTA',
                'NACHOS',
                'PIZZA',
                'SANDWICH',
                'PANINI',
                'MILKSHAKE',
                'MOJITO',
                'BRAVERAGE'
            ], message: "plase select correcr cotogory for this product"

        }
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }

})
module.exports = mongoose.model('Product', productSchema);