const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        category: String,
        price: Number,
        thumbnail: String,
        discount: Number,
        status: String,
        description: String,
        stock: Number,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        deletedBy: {
            idAccountDeleted: String,
            dateDeleted: Date
        },
        createdBy: {
            idAccountCreated: String,
            dateCreated: {
                type: Date,
                default: Date.now
            }
        }
    }
);


const Product = mongoose.model('Product', productSchema, "products");


module.exports = Product;