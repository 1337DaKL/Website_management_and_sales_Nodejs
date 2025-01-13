const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const categorySchema = new mongoose.Schema(
    {
        title: String,
        idParent: String,
        thumbnail: String,
        status: String,
        description: String,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        deletedBy: {
            idAccountDeleted: String,
            nameAccountDeleted: String,
            dateDeleted: Date
        },
        createdBy: {
            idAccountCreated: String,
            nameAccountCreated: String,
            dateCreated: {
                type: Date,
                default: Date.now
            }
        }
        ,
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldCategory: {
                    title: String,
                    idParent: String,
                    thumbnail: String,
                    status: String,
                    description: String,
                    position: Number
                },
                newCategory: {
                    title: String,
                    idParent: String,
                    thumbnail: String,
                    status: String,
                    description: String,
                    position: Number
                },
            }
        ]
    }
);


const Category = mongoose.model('Category', categorySchema, "category");


module.exports = Category;