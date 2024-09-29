const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title : String,
        price : Number,
        thumbnail: String,
        discount : Number,
        status : String,
        description: String,
        stock : Number,
        slug: { type: String, slug: "title" , unique: true },
        deleted: {
            type : Boolean,
            default: false
        },
        dateDeleted: Date,
        position: Number
    },{
        timestamps: true
    }
);


const Product = mongoose.model('Product' , productSchema , "products");


module.exports = Product;