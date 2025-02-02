const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfor: {
            fullName: String,
            email: String,
            telephone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discount: Number,
                quantity: Number
            }
        ],
        dateOrder: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: "pending"
        },
        deleted : {
            type : Boolean,
            default : false
        }
    }
);


const Order = mongoose.model('Order', orderSchema, "order");


module.exports = Order;