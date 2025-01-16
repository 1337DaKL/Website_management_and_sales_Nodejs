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
        featured: String,
        slug: { type: String, slug: "title", unique: true },
        position: Number,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            idAccountDeleted: String,
            nameAccountCreated: String,
            dateDeleted: Date
        },
        createdBy: {
            idAccountCreated: String,
            nameAccountCreated: String,
            dateCreated: {
                type: Date,
                default: Date.now
            }
        },
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldProduct: {
                    title: String,
                    category: String,
                    nameCategory: String,
                    featured: String,
                    price: Number,
                    thumbnail: String,
                    discount: Number,
                    status: String,
                    description: String,
                    stock: Number,
                    position: Number
                },
                newProduct: {
                    title: String,
                    category: String,
                    nameCategory: String,
                    featured: String,
                    price: Number,
                    thumbnail: String,
                    discount: Number,
                    status: String,
                    description: String,
                    stock: Number,
                    position: Number
                },
            }
        ]
    }
);


const Product = mongoose.model('Product', productSchema, "products");


module.exports = Product;