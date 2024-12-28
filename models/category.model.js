const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const categorySchema = new mongoose.Schema(
    {
        title : String,
        idParent: String,
        thumbnail: String,
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


const Category = mongoose.model('Category' , categorySchema , "category");


module.exports = Category;