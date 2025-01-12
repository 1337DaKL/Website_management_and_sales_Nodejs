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


const Category = mongoose.model('Category' , categorySchema , "category");


module.exports = Category;