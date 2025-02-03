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
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldOrder: {
                    userInfor: {
                        fullName: String,
                        email: String,
                        telephone: String,
                        address: String
                    },
                    products: [
                        {
                            quantity: Number
                        }
                    ],
                    status: String
                },
                newOrder: {
                    userInfor: {
                        fullName: String,
                        email: String,
                        telephone: String,
                        address: String
                    },
                    products: [
                        {
                            quantity: Number
                        }
                    ],
                    status: String
                },
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            idAccountDeleted: String,
            nameAccountDeleted: String,
            dateDeleted: Date
        },
    }
);


const Order = mongoose.model('Order', orderSchema, "order");


module.exports = Order;