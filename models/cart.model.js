const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const cartSchema = new mongoose.Schema(
    {
        userId : String,
        product: [
            {                
                productId: String,
                quantity: Number
            }
        ]
    }
);


const Cart = mongoose.model('Cart', cartSchema, "cart");


module.exports = Cart;